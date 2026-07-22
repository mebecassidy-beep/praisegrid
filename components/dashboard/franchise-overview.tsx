import { AlertCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Meter, statusForValue } from "@/components/dashboard/meter";
import type { Location } from "@/types";
import type { LocationMetric } from "@/lib/dashboard/queries";

export function FranchiseOverview({
  locations,
  locationMetrics,
}: {
  locations: Location[];
  locationMetrics: Record<string, LocationMetric>;
}) {
  if (locations.length === 0) {
    return (
      <div className="rounded-lg border bg-card py-16 text-center text-sm text-muted-foreground">
        No locations yet. Add locations to compare them here.
      </div>
    );
  }

  const totals = locations.reduce(
    (acc, loc) => {
      const m = locationMetrics[loc.id] ?? { avgRating: 0, reviewCount: 0, responseRate: 0, pendingCount: 0 };
      acc.reviewCount += m.reviewCount;
      acc.pendingCount += m.pendingCount;
      acc.ratingSum += m.avgRating * m.reviewCount;
      return acc;
    },
    { reviewCount: 0, pendingCount: 0, ratingSum: 0 }
  );
  const blendedRating = totals.reviewCount > 0 ? totals.ratingSum / totals.reviewCount : 0;

  const ranked = [...locations].sort((a, b) => {
    const ma = locationMetrics[a.id]?.avgRating ?? 0;
    const mb = locationMetrics[b.id]?.avgRating ?? 0;
    return mb - ma;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Locations</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight">{locations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Blended average rating</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight">
              {blendedRating > 0 ? (
                <span className="inline-flex items-center gap-1">
                  {blendedRating.toFixed(1)}
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </span>
              ) : (
                "—"
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Pending across all locations</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight">{totals.pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Rating</th>
                  <th className="px-5 py-3 font-medium">Reviews</th>
                  <th className="px-5 py-3 font-medium">Response rate</th>
                  <th className="px-5 py-3 font-medium">Pending</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((location) => {
                  const m = locationMetrics[location.id] ?? {
                    avgRating: 0,
                    reviewCount: 0,
                    responseRate: 0,
                    pendingCount: 0,
                  };
                  const status = statusForValue(m.responseRate);
                  return (
                    <tr key={location.id} className="border-b last:border-0">
                      <td className="px-5 py-3.5">
                        <p className="font-medium">{location.name}</p>
                        <p className="text-xs text-muted-foreground">{location.address}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        {m.reviewCount > 0 ? (
                          <span className="inline-flex items-center gap-1 font-medium">
                            {m.avgRating.toFixed(1)}
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 tabular-nums">{m.reviewCount}</td>
                      <td className="w-40 px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Meter value={m.responseRate} status={status} className="w-16" />
                          <span className="text-xs tabular-nums text-muted-foreground">{m.responseRate}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {m.pendingCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                            <AlertCircle className="h-3 w-3" />
                            {m.pendingCount}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
