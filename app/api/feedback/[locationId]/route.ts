import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { notifyFeedbackResponse } from "@/lib/feedback/notify-feedback-response";

const MAX_COMMENT_LENGTH = 2000;
const MAX_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 32;

// Public, unauthenticated endpoint — a customer reaches this by tapping a
// link in a post-service SMS/email, with no Supabase session. Rate-limited
// by IP (same pattern as /api/public/business-scan) since it has no auth
// boundary otherwise. Every submission is treated identically regardless of
// rating: same insert, same notification path — nothing here decides who
// later sees the public review CTA (the capture page shows that to 100% of
// respondents, see app/feedback/[locationId]/page.tsx).
export async function POST(request: Request, { params }: { params: { locationId: string } }) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(`feedback:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const rating = Number(body?.rating);
    const comment = typeof body?.comment === "string" ? body.comment.trim().slice(0, MAX_COMMENT_LENGTH) : null;
    const customerName =
      typeof body?.customer_name === "string" && body.customer_name.trim()
        ? body.customer_name.trim().slice(0, MAX_NAME_LENGTH)
        : null;
    const customerPhone =
      typeof body?.customer_phone === "string" && body.customer_phone.trim()
        ? body.customer_phone.trim().slice(0, MAX_PHONE_LENGTH)
        : null;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "A rating from 1 to 5 is required." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { data: location } = await (supabase.from("locations") as any)
      .select("id, user_id, name")
      .eq("id", params.locationId)
      .single();

    if (!location) {
      return NextResponse.json({ error: "This feedback link isn't valid." }, { status: 404 });
    }

    const { error: insertError } = await (supabase.from("feedback_responses") as any).insert({
      location_id: location.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      rating,
      comment,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const { data: profile } = await (supabase.from("profiles") as any)
      .select("email, company_name, subscription_tier, alert_phone_number")
      .eq("id", location.user_id)
      .single();

    if (profile) {
      notifyFeedbackResponse({
        businessEmail: profile.email,
        businessName: profile.company_name || location.name,
        alertPhoneNumber: profile.alert_phone_number,
        subscriptionTier: profile.subscription_tier,
        customerName,
        rating,
        comment,
      }).catch(console.error);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error saving feedback response:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
