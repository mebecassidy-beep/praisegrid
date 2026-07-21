"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { FeedPlatform } from "@/lib/dashboard/mock-data";

const PLATFORMS: FeedPlatform[] = ["google", "yelp", "facebook"];

export function ConnectedPlatformsCard() {
  const [connected, setConnected] = useState<Record<FeedPlatform, boolean>>({
    google: true,
    yelp: true,
    facebook: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected platforms</CardTitle>
        <CardDescription>Sync reviews automatically from each connected source.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {PLATFORMS.map((platform) => {
          const meta = PLATFORM_META[platform];
          const isConnected = connected[platform];
          return (
            <div
              key={platform}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.badgeClass}`}>
                  <meta.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{meta.label}</p>
                  <Badge
                    variant="outline"
                    className={
                      isConnected
                        ? "border-transparent bg-emerald-500/10 text-emerald-600"
                        : "border-transparent bg-muted text-muted-foreground"
                    }
                  >
                    {isConnected ? "Connected" : "Not connected"}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant={isConnected ? "outline" : "default"}
                onClick={() => setConnected((prev) => ({ ...prev, [platform]: !prev[platform] }))}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
