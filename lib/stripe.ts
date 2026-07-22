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
