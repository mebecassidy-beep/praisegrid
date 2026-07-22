"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, MessageSquareOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReviewFeedCard } from "@/components/dashboard/review-feed-card";
import { AddLocationModal } from "@/components/dashboard/add-location-modal";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { Review } from "@/types";
import type { Platform } from "@/types/database";
import { cn } from "@/lib/utils";

const TABS: { value: Platform | "all"; label: string }[] = [
  { value: "all", label: "All platforms" },
  { value: "google", label: "Google" },
  { value: "yelp", label: "Yelp" },
  { value: "facebook", label: "Facebook" },
];

export function ReviewStream({
  reviews,
  hasLocation,
  googlePlacesEnabled,
  limit = 4,
}: {
  reviews: Review[];
  hasLocation: boolean;
  googlePlacesEnabled: boolean;
  limit?: number;
}) {
  const [liveReviews, setLiveReviews] = useState(reviews);
  const [tab, setTab] = useState<Platform | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);

  // `reviews` is server-fetched and changes after router.refresh() (e.g. once
  // the Revenue Protection banner approves a response) — useState's initial
  // value only applies on mount, so without this the stream would keep
  // showing pre-refresh data indefinitely.
  useEffect(() => {
    setLiveReviews(reviews);
  }, [reviews]);

  const visible = useMemo(
    () => liveReviews.filter((r) => tab === "all" || r.platform === tab).slice(0, limit),
    [liveReviews, tab, limit]
  );

  function handleReviewUpdate(updated: Review) {
    setLiveReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Multi-platform review stream
            {hasLocation && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
          </CardTitle>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {hasLocation && (
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => {
              const meta = t.value === "all" ? null : PLATFORM_META[t.value];
              return (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    tab === t.value
                      ? "border-blue-500 bg-blue-500/10 text-blue-600"
                      : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {meta && <meta.icon className="h-3 w-3" />}
                  {t.label}
                </button>
              );
            })}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasLocation ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/20 py-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10">
              <MapPin className="h-5 w-5 text-blue-600" />
            </span>
            <div>
              <p className="text-sm font-semibold">No location connected yet</p>
              <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
                Connect your Google Business Profile to see real reviews and AI-drafted responses here.
              </p>
            </div>
            <Button size="sm" onClick={() => setModalOpen(true)} className="mt-1 gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Connect Google Business Profile
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-muted/20 py-12 text-center">
            <MessageSquareOff className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {liveReviews.length === 0
                ? "No reviews yet — check back soon as they come in."
                : "No reviews on this platform yet."}
            </p>
          </div>
        ) : (
          visible.map((review) => (
            <ReviewFeedCard key={review.id} review={review} onReviewUpdate={handleReviewUpdate} />
          ))
        )}
      </CardContent>

      <AddLocationModal open={modalOpen} onClose={() => setModalOpen(false)} googlePlacesEnabled={googlePlacesEnabled} />
    </Card>
  );
}
