import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LocationsGrid } from "@/components/dashboard/locations-grid";

export default function LocationsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
          <p className="text-sm text-muted-foreground">
            Compare review performance and response rates across every location.
          </p>
        </div>

        <LocationsGrid />
      </div>
    </DashboardShell>
  );
}
