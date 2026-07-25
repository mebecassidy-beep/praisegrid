import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { reviewRequestEmail } from "@/lib/email/templates/review-request";
import { sendReviewRequestSms } from "@/lib/sms/send-review-request";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildFeedbackShieldLink } from "@/lib/reviews/public-review-links";
import { getEffectiveAccountId } from "@/lib/team/account";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "Smart timing" delay options for the post-service blast. Anything other
// than "now" is queued in scheduled_blasts and picked up by
// /api/cron/send-scheduled-blasts instead of sent inline.
const VALID_DELAYS = ["now", "2h", "next_morning"];

function computeSendAt(delay: string): Date {
  const now = new Date();
  if (delay === "next_morning") {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
    return next;
  }
  if (delay === "2h") {
    return new Date(now.getTime() + 2 * 60 * 60 * 1000);
  }
  return now;
}

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

    if (!checkRateLimit(`review-blast:${user.id}`, 20, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const method = body?.method === "sms" ? "sms" : body?.method === "email" ? "email" : null;
    const to = typeof body?.to === "string" ? body.to.trim() : "";
    const customerName = typeof body?.customerName === "string" ? body.customerName.trim() : "";
    const locationId = typeof body?.location_id === "string" ? body.location_id : "";
    const delay = typeof body?.delay === "string" && VALID_DELAYS.includes(body.delay) ? body.delay : "now";

    if (!method || !to || !customerName || !locationId) {
      return NextResponse.json(
        { error: "method, to, customerName, and location_id are required." },
        { status: 400 }
      );
    }

    if (method === "email" && !EMAIL_RE.test(to)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const { data: location } = await (supabase.from("locations") as any)
      .select("id, name")
      .eq("id", locationId)
      .eq("user_id", accountId)
      .single();

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    if (delay !== "now") {
      const sendAt = computeSendAt(delay);
      const { error: scheduleError } = await (supabase.from("scheduled_blasts") as any).insert({
        user_id: accountId,
        location_id: locationId,
        method,
        to_address: to,
        customer_name: customerName,
        send_at: sendAt.toISOString(),
      });

      if (scheduleError) {
        return NextResponse.json({ error: scheduleError.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true, scheduled: true, send_at: sendAt.toISOString() });
    }

    const feedbackLink = buildFeedbackShieldLink(locationId);

    if (method === "email") {
      const { subject, html } = reviewRequestEmail({
        customerName,
        businessName: location.name,
        feedbackLink,
      });
      await sendEmail({ to, subject, html });
    } else {
      await sendReviewRequestSms({
        to,
        customerName,
        businessName: location.name,
        feedbackLink,
      });
    }

    return NextResponse.json({ ok: true, scheduled: false });
  } catch (error: any) {
    console.error("Error sending review blast:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
