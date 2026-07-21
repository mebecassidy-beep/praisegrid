"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewFeedCard } from "@/components/dashboard/review-feed-card";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import { FEED_REVIEWS, type FeedPlatform, type FeedStatus } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

const TABS: { value: FeedPlatform | "all"; label: string }[] = [
  { value: "all", label: "All platforms" },
  { value: "google", label: "Google" },
  { value: "yelp", label: "Yelp" },
  { value: "facebook", label: "Facebook" },
];

export function ReviewStream({ limit = 4 }: { limit?: number }) {
  const [reviews, setReviews] = useState(FEED_REVIEWS);
  const [tab, setTab] = useState<FeedPlatform | "all">("all");

  const visible = useMemo(
    () => reviews.filter((r) => tab === "all" || r.platform === tab).slice(0, limit),
    [reviews, tab, limit]
  );

  function handleStatusChange(id: string, status: FeedStatus) {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)));
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Multi-platform review stream
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </CardTitle>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

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
      </CardHeader>
      <CardContent className="space-y-4">
        {visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No reviews on this platform yet.</p>
        ) : (
          visible.map((review) => (
            <ReviewFeedCard key={review.id} review={review} onStatusChange={handleStatusChange} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
