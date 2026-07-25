import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { Location } from "@/types";

/**
 * Reflects real connection state instead of a local toggle. Google and
 * Facebook both have a real OAuth connect flow (per-location, on
 * /locations - see components/dashboard/locations-grid.tsx). Yelp has a
 * schema column (locations.yelp_business_id) but no actual integration
 * built - its public Fusion API is read-only and doesn't support a
 * business-owner login at all, so it's marked "Coming soon" rather than
 * shown as a fake interactive toggle that implies a capability that
 * doesn't exist yet.
 */
export function ConnectedPlatformsCard({
  locations,
  facebookConnected,
}: {
  locations: Location[];
  facebookConnected: boolean;
}) {
  const googleConnected = locations.some((l) => l.google_place_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected platforms</CardTitle>
        <CardDescription>Google syncs your reviews daily. Facebook syncs Page reviews. Yelp is coming soon.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {(
          [
            { platform: "google" as const, connected: googleConnected },
            { platform: "facebook" as const, connected: facebookConnected },
          ]
        ).map(({ platform, connected }) => {
          const meta = PLATFORM_META[platform];
          return (
            <div key={platform} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.badgeClass}`}>
                  <meta.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{meta.label}</p>
                  <Badge
                    variant="outline"
                    className={
                      connected
                        ? "border-transparent bg-emerald-500/10 text-emerald-600"
                        : "border-transparent bg-muted text-muted-foreground"
                    }
                  >
                    {connected ? "Connected" : "Not connected"}
                  </Badge>
                </div>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/locations">{connected ? "Manage" : "Connect"}</Link>
              </Button>
            </div>
          );
        })}

        <div className="flex items-center justify-between gap-3 rounded-lg border p-3 opacity-60">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${PLATFORM_META.yelp.badgeClass}`}>
              <PLATFORM_META.yelp.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{PLATFORM_META.yelp.label}</p>
              <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground">
                Coming soon
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="outline" disabled>
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
