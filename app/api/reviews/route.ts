import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: locations, error: locError } = await (supabase
      .from('locations') as any)
      .select('id')
      .eq('user_id', user.id)

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
