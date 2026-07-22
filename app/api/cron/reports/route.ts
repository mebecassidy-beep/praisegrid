import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";
import { sendEmail } from "@/lib/email/client";
import { reputationReportEmail } from "@/lib/email/templates/reputation-report";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data: profiles } = await (supabase.from("profiles") as any)
    .select("id, email, company_name, report_frequency")
    .neq("report_frequency", "off");

  const today = new Date();
  const isMonday = today.getUTCDay() === 1;
  const isFirstOfMonth = today.getUTCDate() === 1;

  let sent = 0;

  for (const profile of profiles ?? []) {
    const due =
      (profile.report_frequency === "weekly" && isMonday) ||
      (profile.report_frequency === "monthly" && isFirstOfMonth);

    if (!due) continue;

    try {
      const data = await getDashboardData(profile.id, supabase);
      const { subject, html } = reputationReportEmail({
        companyName: profile.company_name || profile.email,
        frequencyLabel: profile.report_frequency === "weekly" ? "week" : "month",
        data,
      });

      await sendEmail({ to: profile.email, subject, html });
      sent += 1;
    } catch (error) {
      console.error(`Failed to send reputation report to ${profile.email}:`, error);
    }
  }

  return NextResponse.json({ processed: profiles?.length ?? 0, sent });
}
