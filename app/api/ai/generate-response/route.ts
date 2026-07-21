import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateReviewResponse } from '@/lib/anthropic/client'

export async function POST(request: Request) {
  try {
    const { review_id, location_id, tone, instructions, sign_off_name } = await request.json()

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: review, error: reviewError } = await (supabase
      .from('reviews') as any)
      .select('*')
      .eq('id', review_id)
      .eq('location_id', location_id)
      .single()

    if (reviewError || !review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const { data: settings } = await (supabase
      .from('ai_settings') as any)
      .select('tone, instructions, sign_off_name')
      .eq('location_id', location_id)
      .maybeSingle()

    const responseText = await generateReviewResponse({
      reviewText: review.body || review.content,
      reviewerName: review.author_name,
      rating: review.rating,
      tone: tone || settings?.tone || 'professional',
      instructions: instructions || settings?.instructions,
      signOffName: sign_off_name || settings?.sign_off_name
    })

    return NextResponse.json({ response: responseText })
  } catch (error: any) {
    console.error('Error generating AI response:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
