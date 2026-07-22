import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OnboardingModal } from "@/components/dashboard/onboarding-modal";
import { requireUser } from "@/lib/supabase/server";
import { getProfile } from "@/lib/dashboard/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  return (
    <DashboardShell tier={profile.subscription_tier} userEmail={profile.email}>
      {children}
      {!profile.onboarding_completed_at && <OnboardingModal tier={profile.subscription_tier} />}
    </DashboardShell>
  );
}
