"use client";

import { useState } from "react";
import { AlertCircle, Check, Lock, MapPin, Plus, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Meter, statusForValue } from "@/components/dashboard/meter";
import { AddLocationModal } from "@/components/dashboard/add-location-modal";
import type { Location } from "@/types";
import type { LocationMetric } from "@/lib/dashboard/queries";

export function LocationsGrid({
  locations,
  locationMetrics,
  googlePlacesEnabled,
  gbpOAuthEnabled,
  connectedLocationIds,
  facebookOAuthEnabled,
  connectedFacebookLocationIds,
}: {
  locations: Location[];
  locationMetrics: Record<string, LocationMetric>;
  googlePlacesEnabled: boolean;
  gbpOAuthEnabled: boolean;
  connectedLocationIds: Set<string>;
  facebookOAuthEnabled: boolean;
  connectedFacebookLocationIds: Set<string>;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (locations.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/20 py-16 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10">
            <MapPin className="h-5 w-5 text-blue-600" />
          </span>
          <div>
            <p className="text-sm font-semibold">No locations yet</p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
              Add your first location to start tracking reviews and AI-drafted responses.
            </p>
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)} className="mt-1 gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Connect Google Business Profile
          </Button>
        </div>
        <AddLocationModal open={modalOpen} onClose={() => setModalOpen(false)} googlePlacesEnabled={googlePlacesEnabled} />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => setModalOpen(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add location
        </Button>
      </div>

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

                <div className="space-y-2 border-t pt-3">
                  {connectedLocationIds.has(location.id) ? (
                    <Badge variant="outline" className="gap-1 border-transparent bg-emerald-500/10 text-emerald-600">
                      <Check className="h-3 w-3" />
                      Google: full sync &amp; auto-reply active
                    </Badge>
                  ) : gbpOAuthEnabled ? (
                    <Button size="sm" variant="outline" className="w-full gap-1.5" asChild>
                      <a href={`/api/auth/google-business/start?location_id=${location.id}`}>
                        Enable Google full sync &amp; auto-reply
                      </a>
                    </Button>
                  ) : (
                    <Badge variant="outline" className="gap-1 border-transparent bg-muted text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Google full sync &amp; auto-reply, coming soon
                    </Badge>
                  )}

                  {connectedFacebookLocationIds.has(location.id) ? (
                    <Badge variant="outline" className="gap-1 border-transparent bg-emerald-500/10 text-emerald-600">
                      <Check className="h-3 w-3" />
                      Facebook: review sync active
                    </Badge>
                  ) : facebookOAuthEnabled ? (
                    <Button size="sm" variant="outline" className="w-full gap-1.5" asChild>
                      <a href={`/api/auth/facebook/start?location_id=${location.id}`}>Enable Facebook review sync</a>
                    </Button>
                  ) : (
                    <Badge variant="outline" className="gap-1 border-transparent bg-muted text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Facebook review sync, coming soon
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddLocationModal open={modalOpen} onClose={() => setModalOpen(false)} googlePlacesEnabled={googlePlacesEnabled} />
    </div>
  );
}
