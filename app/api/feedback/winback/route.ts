import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { sendWinbackSms } from "@/lib/sms/send-winback-sms";
import { getEffectiveAccountId } from "@/lib/team/account";

// One-click "olive branch" SMS for a customer who left a low private rating
// through Feedback Shield. Requires the signed-in business owner, only
// fires for 1-2 star responses with a phone on file, and is idempotent
// (winback_sent_at blocks a second send).
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const responseId = typeof body?.responseId === "string" ? body.responseId : "";

    if (!responseId) {
      return NextResponse.json({ error: "responseId is required." }, { status: 400 });
    }

    const { data: feedbackResponse } = await (supabase.from("feedback_responses") as any)
      .select("id, rating, customer_name, customer_phone, winback_sent_at, location_id, locations(name, user_id)")
      .eq("id", responseId)
      .single();

    const accountId = await getEffectiveAccountId(user.id, supabase);
    if (!feedbackResponse || feedbackResponse.locations?.user_id !== accountId) {
      return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
    }

    if (feedbackResponse.rating > 2) {
      return NextResponse.json({ error: "Win-back SMS is only for 1-2 star feedback." }, { status: 400 });
    }

    if (!feedbackResponse.customer_phone) {
      return NextResponse.json({ error: "No phone number on file for this customer." }, { status: 400 });
    }

    if (feedbackResponse.winback_sent_at) {
      return NextResponse.json({ error: "Already sent." }, { status: 409 });
    }

    const { data: profile } = await (supabase.from("profiles") as any)
      .select("company_name")
      .eq("id", accountId)
      .single();

    await sendWinbackSms({
      to: feedbackResponse.customer_phone,
      customerName: feedbackResponse.customer_name,
      businessName: profile?.company_name || feedbackResponse.locations?.name || "our team",
    });

    const { error: updateError } = await (supabase.from("feedback_responses") as any)
      .update({ winback_sent_at: new Date().toISOString() })
      .eq("id", responseId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error sending win-back SMS:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
