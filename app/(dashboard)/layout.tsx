import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const [profile, data] = await Promise.all([getProfile(user.id), getDashboardData(user.id)]);

  return (
    <DashboardShell
      tier={profile.subscription_tier}
      userEmail={profile.email}
      locations={data.locations}
      reviews={data.reviews}
    >
      {children}
    </DashboardShell>
  );
}
