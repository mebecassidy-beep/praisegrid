export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'
import { classifyReviewRisk } from '@/lib/reviews/classify-risk'
import { sendCrisisAlertSms } from '@/lib/sms/send-crisis-alert'
import { hasProAccess } from '@/lib/subscription'
import { getEffectiveAccountId } from '@/lib/team/account'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = await getEffectiveAccountId(user.id, supabase)
    const { data: locations, error: locError } = await (supabase
      .from('locations') as any)
      .select('id')
      .eq('user_id', accountId)

    if (locError) {
      return NextResponse.json({ error: locError.message }, { status: 500 })
    }

    const locationIds = (locations || []).map((loc: any) => loc.id)

    if (locationIds.length === 0) {
      return NextResponse.json({ reviews: [] })
    }

    const { data: reviews, error: revError } = await (supabase
      .from('reviews') as any)
      .select('*')
      .in('location_id', locationIds)
      .order('created_at', { ascending: false })

    if (revError) {
      return NextResponse.json({ error: revError.message }, { status: 500 })
    }

    return NextResponse.json({ reviews })
  } catch (error: any) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

const VALID_PLATFORMS = ['google', 'yelp', 'facebook']

// Ingests a single review for one of the caller's own locations. There's no
// real platform-sync webhook yet (Google/Yelp/Facebook), so this is scoped to
// the location owner's own session — it's also the natural landing spot a
// future sync webhook would extend (swap the session check for a signature
// check, keep the classify/insert/alert logic as-is).
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { location_id, platform, reviewer_name, review_text, review_date } = body ?? {}
    const rating = Number(body?.rating)

    if (
      typeof location_id !== 'string' ||
      !VALID_PLATFORMS.includes(platform) ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        { error: 'location_id, a valid platform, and an integer rating 1-5 are required.' },
        { status: 400 }
      )
    }

    const accountId = await getEffectiveAccountId(user.id, supabase)
    const { data: location } = await (supabase
      .from('locations') as any)
      .select('id')
      .eq('id', location_id)
      .eq('user_id', accountId)
      .single()

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const riskLevel = classifyReviewRisk(rating, review_text ?? null)

    const { data: review, error: insertError } = await (supabase
      .from('reviews') as any)
      .insert({
        location_id,
        platform,
        reviewer_name: reviewer_name ?? null,
        rating,
        review_text: review_text ?? null,
        review_date: review_date ?? null,
        risk_level: riskLevel,
        flagged_at: riskLevel ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    if (riskLevel === 'high') {
      const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('subscription_tier, alert_phone_number, company_name')
        .eq('id', accountId)
        .single()

      if (hasProAccess(profile?.subscription_tier) && profile?.alert_phone_number) {
        sendCrisisAlertSms({
          to: profile.alert_phone_number,
          businessName: profile.company_name || 'your business',
          reviewText: review_text ?? null,
        }).catch(console.error)
      }
    }

    return NextResponse.json({ review })
  } catch (error: any) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
