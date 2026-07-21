import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { SubscriptionTier } from "@/types";

const TIER_BY_PRICE_LOOKUP_KEY: Record<string, SubscriptionTier> = {
  starter: "starter",
  pro: "pro",
  enterprise: "enterprise",
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
      const lookupKey = subscription.items.data[0]?.price?.lookup_key ?? "";
      const tier = TIER_BY_PRICE_LOOKUP_KEY[lookupKey] ?? "free";

      await supabase
        .from("profiles")
        .update({ subscription_tier: tier })
        .eq("stripe_customer_id", customerId);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

      await supabase
        .from("profiles")
        .update({ subscription_tier: "free" })
        .eq("stripe_customer_id", customerId);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
