import { LocationsGrid } from "@/components/dashboard/locations-grid";
import { GbpConnectStatusBanner } from "@/components/dashboard/gbp-connect-status-banner";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";
import { getConnectedLocationIds } from "@/lib/google-business-profile/queries";
import { isGbpOAuthConfigured } from "@/lib/google-business-profile/client";

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: { gbp_status?: string; gbp_message?: string };
}) {
  const user = await requireUser();
  const data = await getDashboardData(user.id);
  const connectedLocationIds = await getConnectedLocationIds(data.locations.map((l) => l.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
        <p className="text-sm text-muted-foreground">
          Compare review performance and response rates across every location.
        </p>
      </div>

      <GbpConnectStatusBanner status={searchParams.gbp_status} message={searchParams.gbp_message} />

      <LocationsGrid
        locations={data.locations}
        locationMetrics={data.locationMetrics}
        googlePlacesEnabled={Boolean(process.env.GOOGLE_PLACES_API_KEY)}
        gbpOAuthEnabled={isGbpOAuthConfigured()}
        connectedLocationIds={connectedLocationIds}
      />
    </div>
  );
}
