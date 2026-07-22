"use client";

import { useState } from "react";
import { AlertTriangle, HeartPulse, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { statusForValue } from "@/components/dashboard/meter";
import { AddLocationModal } from "@/components/dashboard/add-location-modal";

const STATUS_MESSAGE = {
  good: "Your reputation is in great shape.",
  warning: "A few things need attention before they become a problem.",
  critical: "Unanswered reviews are actively hurting your rating.",
} as const;

export function HealthMeterCard({
  healthScore,
  pendingCount,
  googlePlacesEnabled,
}: {
  healthScore: number | null;
  pendingCount: number;
  googlePlacesEnabled: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (healthScore === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-blue-500" />
            Reputation Health
          </CardTitle>
          <CardDescription>
            Connect a location and get your first reviews in to see your health score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Connect Google Business Profile
          </Button>
        </CardContent>
        <AddLocationModal open={modalOpen} onClose={() => setModalOpen(false)} googlePlacesEnabled={googlePlacesEnabled} />
      </Card>
    );
  }

  const status = statusForValue(healthScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-blue-500" />
          Reputation Health
        </CardTitle>
        <CardDescription>{STATUS_MESSAGE[status]}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ScoreRing score={healthScore} />

          {pendingCount > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                <span className="font-semibold">{pendingCount}</span> unanswered review
                {pendingCount === 1 ? "" : "s"} waiting on a response
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Every review is answered — nothing waiting on you right now.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
