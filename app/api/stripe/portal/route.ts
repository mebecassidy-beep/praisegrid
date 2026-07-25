import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("stripe_customer_id")
      .eq("id", accountId)
      .single();

    const customerId = (profile as any)?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json(
        { error: "No billing account yet, subscribe to a plan first." },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.headers.get("origin")}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
