import { NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'
import {
  stripe,
  CHECKOUT_OFFERS,
  getOrCreateOfferCoupon,
  TIER_TO_PRICE_ID,
  type CheckoutOfferId,
  type SubscriptionTier,
} from '@/lib/stripe'

const VALID_TIERS: SubscriptionTier[] = ['starter', 'pro']

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const offer: CheckoutOfferId | undefined =
      typeof body?.offer === 'string' && body.offer in CHECKOUT_OFFERS ? body.offer : undefined

    const tier: SubscriptionTier = VALID_TIERS.includes(body?.tier) ? body.tier : 'pro'
    const trial = body?.trial === true
    const priceId = TIER_TO_PRICE_ID[tier]

    if (!priceId) {
      return NextResponse.json(
        { error: `No Stripe price configured for tier "${tier}".` },
        { status: 500 }
      )
    }

    const supabase = createRouteHandlerSupabaseClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await (supabase
      .from('profiles') as any)
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = (profile as any)?.stripe_customer_id ?? undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      await (supabase
        .from('profiles') as any)
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const discounts = offer ? [{ coupon: await getOrCreateOfferCoupon(offer) }] : undefined

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      // Trial checkouts collect a card only if something is actually due
      // today (e.g. a partial-period charge) — with a full trial and no
      // discount stacking weirdness, nothing is due, so Stripe skips the
      // card step entirely. This is what makes "No credit card required"
      // in the upgrade UI an accurate claim rather than a false promise.
      payment_method_collection: trial ? 'if_required' : 'always',
      subscription_data: trial ? { trial_period_days: 7 } : undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      discounts,
      // Stripe rejects a session with both `discounts` and `allow_promotion_codes`
      // set — only offer the promo-code field when a landing-page offer isn't
      // already forcing a discount (e.g. the WELCOME20 welcome-email code).
      allow_promotion_codes: offer ? undefined : true,
      success_url: `${request.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${request.headers.get('origin')}/dashboard?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
