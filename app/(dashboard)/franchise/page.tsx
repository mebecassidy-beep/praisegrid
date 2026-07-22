import { FranchiseOverview } from "@/components/dashboard/franchise-overview";
import { FranchiseLockedState } from "@/components/dashboard/franchise-locked-state";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";

export default async function FranchisePage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  if (profile.subscription_tier === "free") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <FranchiseLockedState />
      </div>
    );
  }

  const data = await getDashboardData(user.id);

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
