import { AlertCircle, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meter, statusForValue } from "@/components/dashboard/meter";
import type { Location } from "@/types";
import type { LocationMetric } from "@/lib/dashboard/queries";

export function LocationsGrid({
  locations,
  locationMetrics,
}: {
  locations: Location[];
  locationMetrics: Record<string, LocationMetric>;
}) {
  if (locations.length === 0) {
    return (
      <div className="rounded-lg border bg-card py-16 text-center text-sm text-muted-foreground">
        No locations yet. Add your first location to start tracking reviews.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => {
        const metric = locationMetrics[location.id] ?? {
          avgRating: 0,
          reviewCount: 0,
          responseRate: 0,
          pendingCount: 0,
        };
        const status = statusForValue(metric.responseRate);

        return (
          <Card key={location.id}>
            <CardHeader>
              <CardTitle className="flex items-start gap-2 text-base">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {location.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{location.address}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold tracking-tight">
                    <span className="inline-flex items-center gap-1">
                      {metric.avgRating.toFixed(1)}
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{metric.reviewCount} reviews</p>
                </div>
                {metric.pendingCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {metric.pendingCount} pending
                  </span>
                )}
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Response rate</span>
                  <span className="font-medium text-foreground/90">{metric.responseRate}%</span>
                </div>
                <Meter value={metric.responseRate} status={status} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
