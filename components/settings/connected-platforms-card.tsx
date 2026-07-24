import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { Location } from "@/types";

/**
 * Reflects real connection state instead of a local toggle. Google is the
 * only platform with a real connect flow anywhere in this codebase (see
 * add-location-modal.tsx / google-place-search.tsx) — Yelp and Facebook
 * have a schema column (locations.yelp_business_id) but no actual
 * integration built, so they're marked "Coming soon" rather than shown as a
 * fake interactive toggle that implies a capability that doesn't exist yet.
 */
export function ConnectedPlatformsCard({ locations }: { locations: Location[] }) {
  const googleConnected = locations.some((l) => l.google_place_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected platforms</CardTitle>
        <CardDescription>Google syncs your 5 most recent reviews daily. Yelp and Facebook are coming soon.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${PLATFORM_META.google.badgeClass}`}>
              <PLATFORM_META.google.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{PLATFORM_META.google.label}</p>
              <Badge
                variant="outline"
                className={
                  googleConnected
                    ? "border-transparent bg-emerald-500/10 text-emerald-600"
                    : "border-transparent bg-muted text-muted-foreground"
                }
              >
                {googleConnected ? "Connected" : "Not connected"}
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/locations">{googleConnected ? "Manage" : "Connect"}</Link>
          </Button>
        </div>

        {(["yelp", "facebook"] as const).map((platform) => {
          const meta = PLATFORM_META[platform];
          return (
            <div key={platform} className="flex items-center justify-between gap-3 rounded-lg border p-3 opacity-60">
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.badgeClass}`}>
                  <meta.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{meta.label}</p>
                  <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground">
                    Coming soon
                  </Badge>
                </div>
              </div>
              <Button size="sm" variant="outline" disabled>
                Connect
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
