import { FranchiseOverview } from "@/components/dashboard/franchise-overview";
import { FranchiseLockedState } from "@/components/dashboard/franchise-locked-state";
import { requireAccount } from "@/lib/team/account";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";
import { hasProAccess } from "@/lib/subscription";

export default async function FranchisePage() {
  const { accountId } = await requireAccount();
  const profile = await getProfile(accountId);

  if (!hasProAccess(profile.subscription_tier)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <FranchiseLockedState />
      </div>
    );
  }

  const data = await getDashboardData(accountId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Franchise View</h1>
        <p className="text-sm text-muted-foreground">
          Compare every location side by side at a glance.
        </p>
      </div>

      <FranchiseOverview locations={data.locations} locationMetrics={data.locationMetrics} />
    </div>
  );
}
