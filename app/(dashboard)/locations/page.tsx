import { LocationsGrid } from "@/components/dashboard/locations-grid";
import { ConnectStatusBanner } from "@/components/dashboard/connect-status-banner";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";
import { getConnectedLocationIds } from "@/lib/oauth/queries";
import { isGbpOAuthConfigured } from "@/lib/google-business-profile/client";
import { isFacebookOAuthConfigured } from "@/lib/facebook/client";

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: { gbp_status?: string; gbp_message?: string; fb_status?: string; fb_message?: string };
}) {
  const user = await requireUser();
  const data = await getDashboardData(user.id);
  const locationIds = data.locations.map((l) => l.id);
  const [connectedLocationIds, connectedFacebookLocationIds] = await Promise.all([
    getConnectedLocationIds(locationIds, "google"),
    getConnectedLocationIds(locationIds, "facebook"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
        <p className="text-sm text-muted-foreground">
          Compare review performance and response rates across every location.
        </p>
      </div>

      <ConnectStatusBanner
        status={searchParams.gbp_status}
        message={searchParams.gbp_message}
        connectedMessage="Google Business Profile connected. Full review history and reply-posting are now active for this location."
        defaultErrorMessage="Couldn't connect Google Business Profile. Please try again."
      />
      <ConnectStatusBanner
        status={searchParams.fb_status}
        message={searchParams.fb_message}
        connectedMessage="Facebook Page connected. Review sync is now active for this location."
        defaultErrorMessage="Couldn't connect your Facebook Page. Please try again."
      />

      <LocationsGrid
        locations={data.locations}
        locationMetrics={data.locationMetrics}
        googlePlacesEnabled={Boolean(process.env.GOOGLE_PLACES_API_KEY)}
        gbpOAuthEnabled={isGbpOAuthConfigured()}
        connectedLocationIds={connectedLocationIds}
        facebookOAuthEnabled={isFacebookOAuthConfigured()}
        connectedFacebookLocationIds={connectedFacebookLocationIds}
      />
    </div>
  );
}
