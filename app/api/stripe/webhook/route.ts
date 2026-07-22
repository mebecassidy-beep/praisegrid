import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, PRICE_ID_TO_TIER } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Webhooks are server-to-server calls from Stripe — there's no browser
  // session/cookies here, so this must bypass RLS via the service role client
  // rather than a cookie-scoped one (which would silently no-op the update).
  const supabase = createServiceRoleClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    )

    const customerId = session.customer as string
    const priceId = subscription.items.data[0].price.id
    const tier = PRICE_ID_TO_TIER[priceId] ?? 'free'

    await (supabase
      .from('profiles') as any)
      .update({ subscription_tier: tier } as any)
      .eq('stripe_customer_id', customerId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    const customerId = subscription.customer as string

    await (supabase
      .from('profiles') as any)
      .update({ subscription_tier: 'free' } as any)
      .eq('stripe_customer_id', customerId)
  }

  return new NextResponse(null, { status: 200 })
}
