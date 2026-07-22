import { LocationsGrid } from "@/components/dashboard/locations-grid";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";

export default async function LocationsPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
        <p className="text-sm text-muted-foreground">
          Compare review performance and response rates across every location.
        </p>
      </div>

      <LocationsGrid
        locations={data.locations}
        locationMetrics={data.locationMetrics}
        googlePlacesEnabled={Boolean(process.env.GOOGLE_PLACES_API_KEY)}
      />
    </div>
  );
}
