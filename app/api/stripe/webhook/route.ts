import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    )

    const customerId = session.customer as string
    const tier = subscription.items.data[0].price.id === process.env.STRIPE_PRICE_ID ? 'pro' : 'free'

    await (supabase
      .from('profiles') as any)
      .update({ subscription_tier: tier } as any)
      .eq('stripe_customer_id', customerId)
  }

  return new NextResponse(null, { status: 200 })
}
