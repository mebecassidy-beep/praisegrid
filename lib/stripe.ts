import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
  typescript: true,
})

// Offers that can be applied at checkout, keyed by the `offer` param passed
// through from a landing page CTA (e.g. /scan -> /signup?offer=scan50 -> checkout).
// Each maps to a stable Stripe Coupon id so re-running this doesn't create duplicates.
export const CHECKOUT_OFFERS = {
  scan50: { couponId: 'scan-landing-50-off-first-month', percentOff: 50 },
} as const

export type CheckoutOfferId = keyof typeof CHECKOUT_OFFERS

export type SubscriptionTier = 'starter' | 'pro'

// Maps a Stripe Price id to the plan tier it grants. Used by the checkout
// route (to pick a price for a requested tier) and the webhook (to translate
// the subscription's price back into `profiles.subscription_tier`).
export const TIER_TO_PRICE_ID: Record<SubscriptionTier, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
}

export const PRICE_ID_TO_TIER: Record<string, SubscriptionTier> = Object.fromEntries(
  (Object.entries(TIER_TO_PRICE_ID) as [SubscriptionTier, string | undefined][])
    .filter((entry): entry is [SubscriptionTier, string] => Boolean(entry[1]))
    .map(([tier, priceId]) => [priceId, tier])
)

export async function getOrCreateOfferCoupon(offerId: CheckoutOfferId): Promise<string> {
  const offer = CHECKOUT_OFFERS[offerId]

  try {
    await stripe.coupons.retrieve(offer.couponId)
  } catch {
    await stripe.coupons.create({
      id: offer.couponId,
      percent_off: offer.percentOff,
      duration: 'once', // applies to the first invoice only, i.e. "first month"
      name: `${offer.percentOff}% off first month`,
    })
  }

  return offer.couponId
}

// Welcome-email retention offer: a Stripe Promotion Code (not auto-applied)
// that a new user can type into the Checkout Session's own promo-code field
// (see `allow_promotion_codes` in app/api/stripe/checkout/route.ts) whenever
// they're ready to subscribe — `duration: 'once'` discounts whatever their
// next invoice is at that point, which in practice is the month after they
// redeem it right after signing up.
export const WELCOME_OFFER = {
  code: 'WELCOME20',
  couponId: 'welcome-20-off-second-month',
  percentOff: 20,
} as const

export async function getOrCreateWelcomePromotionCode(): Promise<string> {
  try {
    await stripe.coupons.retrieve(WELCOME_OFFER.couponId)
  } catch {
    await stripe.coupons.create({
      id: WELCOME_OFFER.couponId,
      percent_off: WELCOME_OFFER.percentOff,
      duration: 'once',
      name: '20% off — welcome offer',
    })
  }

  const existing = await stripe.promotionCodes.list({
    code: WELCOME_OFFER.code,
    active: true,
    limit: 1,
  })
  if (existing.data.length > 0) {
    return existing.data[0].code
  }

  const created = await stripe.promotionCodes.create({
    coupon: WELCOME_OFFER.couponId,
    code: WELCOME_OFFER.code,
  })
  return created.code
}
