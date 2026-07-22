import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FranchiseOverview } from "@/components/dashboard/franchise-overview";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";

export default async function FranchisePage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Franchise View</h1>
          <p className="text-sm text-muted-foreground">
            Compare every location side by side at a glance.
          </p>
        </div>

        <FranchiseOverview locations={data.locations} locationMetrics={data.locationMetrics} />
      </div>
    </DashboardShell>
  );
}
