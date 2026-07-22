import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { reviewRequestEmail } from "@/lib/email/templates/review-request";
import { sendReviewRequestSms } from "@/lib/sms/send-review-request";
import { buildFeedbackShieldLink } from "@/lib/reviews/public-review-links";

// Polls for due "smart timing" blasts (see /api/reviews/blast's delay
// option) and sends them. Runs every 15 minutes via vercel.ts.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data: due } = await (supabase.from("scheduled_blasts") as any)
    .select("id, location_id, method, to_address, customer_name")
    .is("sent_at", null)
    .lte("send_at", new Date().toISOString())
    .limit(100);

  let sent = 0;

  for (const blast of due ?? []) {
    try {
      const { data: location } = await (supabase.from("locations") as any)
        .select("name")
        .eq("id", blast.location_id)
        .single();

      const feedbackLink = buildFeedbackShieldLink(blast.location_id);
      const businessName = location?.name ?? "our business";

      if (blast.method === "email") {
        const { subject, html } = reviewRequestEmail({
          customerName: blast.customer_name,
          businessName,
          feedbackLink,
        });
        await sendEmail({ to: blast.to_address, subject, html });
      } else {
        await sendReviewRequestSms({
          to: blast.to_address,
          customerName: blast.customer_name,
          businessName,
          feedbackLink,
        });
      }

      await (supabase.from("scheduled_blasts") as any)
        .update({ sent_at: new Date().toISOString() })
        .eq("id", blast.id);

      sent += 1;
    } catch (error) {
      console.error(`Failed to send scheduled blast ${blast.id}:`, error);
    }
  }

  return NextResponse.json({ processed: due?.length ?? 0, sent });
}
