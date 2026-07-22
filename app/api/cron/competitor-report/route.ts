import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";
import { getCompetitorSnapshot } from "@/lib/competitor/get-competitor-snapshot";
import { sendEmail } from "@/lib/email/client";
import { competitorReportEmail } from "@/lib/email/templates/competitor-report";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data: profiles } = await (supabase.from("profiles") as any)
    .select("id, email, company_name, competitor_name")
    .not("competitor_name", "is", null);

  let sent = 0;

  for (const profile of profiles ?? []) {
    if (!profile.competitor_name) continue;

    try {
      const data = await getDashboardData(profile.id, supabase);
      const competitor = await getCompetitorSnapshot(profile.competitor_name);

      const { subject, html } = competitorReportEmail({
        companyName: profile.company_name || profile.email,
        yourRating: data.avgRating,
        yourReviewCount: data.totalReviews,
        competitorName: competitor.competitorName,
        competitorRating: competitor.rating,
        competitorReviewCount: competitor.reviewCount,
        isRealData: competitor.isRealData,
      });

      await sendEmail({ to: profile.email, subject, html });
      sent += 1;
    } catch (error) {
      console.error(`Failed to send competitor report to ${profile.email}:`, error);
    }
  }

  return NextResponse.json({ processed: profiles?.length ?? 0, sent });
}
