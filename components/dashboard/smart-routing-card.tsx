"use client";

import { useState } from "react";
import { Globe, Lock, Split, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { FeedPlatform } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

const PLATFORMS: FeedPlatform[] = ["google", "yelp", "facebook"];

export function SmartRoutingCard() {
  const [enabled, setEnabled] = useState(true);
  const [threshold, setThreshold] = useState(4);
  const [selectedRating, setSelectedRating] = useState(5);

  const routedPublic = !enabled || selectedRating >= threshold;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Split className="h-4 w-4 text-blue-500" />
            Smart routing
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Toggle smart routing" />
        </div>
        <CardDescription>
          Catch low-rated feedback privately so you can make it right before it goes public.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={cn("space-y-2 transition-opacity", !enabled && "opacity-40")}>
          <Label htmlFor="threshold">Route below this rating privately</Label>
          <div className="flex items-center gap-3">
            <input
              id="threshold"
              type="range"
              min={2}
              max={5}
              step={1}
              value={threshold}
              disabled={!enabled}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer accent-blue-600 disabled:cursor-not-allowed"
            />
            <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums">
              Below {threshold}★
            </span>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="mb-3 text-xs font-medium text-muted-foreground">
            Try it — pick a rating to preview where it routes
          </p>
          <div className="mb-4 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setSelectedRating(n)}
                className="rounded p-0.5 transition-transform hover:scale-110"
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    n <= selectedRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-stretch gap-3">
            <div
              className={cn(
                "flex-1 rounded-lg border p-3 text-center transition-colors",
                !routedPublic ? "border-blue-500 bg-blue-500/5" : "border-border opacity-40"
              )}
            >
              <Lock className="mx-auto mb-1 h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium">Private feedback</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Sent to your inbox</p>
            </div>
            <div
              className={cn(
                "flex-1 rounded-lg border p-3 text-center transition-colors",
                routedPublic ? "border-blue-500 bg-blue-500/5" : "border-border opacity-40"
              )}
            >
              <Globe className="mx-auto mb-1 h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium">Public platforms</p>
              <div className="mt-1 flex justify-center gap-1.5">
                {PLATFORMS.map((p) => {
                  const meta = PLATFORM_META[p];
                  return <meta.icon key={p} className="h-3 w-3 text-muted-foreground" />;
                })}
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            {enabled
              ? routedPublic
                ? `${selectedRating}★ meets your threshold — routed publicly for maximum visibility.`
                : `${selectedRating}★ is caught privately so you can follow up before it's public.`
              : "Smart routing is off — all feedback goes straight to public platforms."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
