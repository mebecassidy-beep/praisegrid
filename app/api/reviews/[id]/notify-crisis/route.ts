import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { sendCrisisSlackNotification } from "@/lib/slack/send-crisis-notification";

// Manual, on-demand Slack notification for a specific high-risk review (the
// "Notify Crisis Manager" button) - complements the automatic SMS crisis
// alert in lib/sms/send-crisis-alert.ts, which fires once on ingestion for
// pro-tier accounts. This lets an owner re-notify their team any time, e.g.
// after escalating internally or if the SMS alert was missed.
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: review } = await (supabase.from("reviews") as any)
      .select("id, platform, reviewer_name, review_text, location_id, locations!inner(user_id, name)")
      .eq("id", params.id)
      .single();

    if (!review || review.locations?.user_id !== user.id) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const { data: profile } = await (supabase.from("profiles") as any)
      .select("crisis_slack_webhook_url")
      .eq("id", user.id)
      .single();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://reputicious.vercel.app";

    const result = await sendCrisisSlackNotification({
      webhookUrl: profile?.crisis_slack_webhook_url ?? null,
      businessName: review.locations?.name ?? "your business",
      reviewerName: review.reviewer_name,
      reviewText: review.review_text,
      platform: review.platform,
      dashboardUrl: `${siteUrl}/reviews`,
    });

    if (!result.sent) {
      return NextResponse.json(
        { error: "No Slack webhook configured yet. Add one in Settings to enable this." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error sending crisis Slack notification:", error);
    return NextResponse.json({ error: error.message || "Something went wrong." }, { status: 500 });
  }
}
