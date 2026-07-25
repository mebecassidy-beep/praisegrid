import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAccount } from "@/lib/team/account";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accountId } = await requireAccount();
  const [profile, data] = await Promise.all([getProfile(accountId), getDashboardData(accountId)]);

  return (
    <DashboardShell
      tier={profile.subscription_tier}
      // The real logged-in user's email, not the account's - a team member
      // sees the owner's data (profile above) but should see their own
      // email in the shell chrome, not be told they're "logged in as" the
      // person who invited them.
      userEmail={user.email ?? profile.email}
      locations={data.locations}
      reviews={data.reviews}
    >
      {children}
    </DashboardShell>
  );
}
