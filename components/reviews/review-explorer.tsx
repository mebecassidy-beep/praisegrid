"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewFeedCard } from "@/components/dashboard/review-feed-card";
import { AddLocationModal } from "@/components/dashboard/add-location-modal";
import { ExportReviewsButton } from "@/components/reviews/export-reviews-button";
import { FilterPills } from "@/components/shared/filter-pills";
import { crisisRank, getDisplayStatus, type DisplayStatus } from "@/lib/reviews/display-status";
import type { Review } from "@/types";
import type { Platform } from "@/types/database";

const PLATFORM_FILTERS: { value: Platform | "all"; label: string }[] = [
  { value: "all", label: "All platforms" },
  { value: "google", label: "Google" },
  { value: "yelp", label: "Yelp" },
  { value: "facebook", label: "Facebook" },
];

const STATUS_FILTERS: { value: DisplayStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "flagged", label: "Flagged" },
  { value: "approved", label: "Approved" },
  { value: "posted", label: "Responded" },
];

export function ReviewExplorer({
  reviews,
  hasLocation,
  googlePlacesEnabled,
  initialQuery,
}: {
  reviews: Review[];
  hasLocation: boolean;
  googlePlacesEnabled: boolean;
  initialQuery?: string;
}) {
  const [liveReviews, setLiveReviews] = useState(reviews);
  const [query, setQuery] = useState(initialQuery ?? "");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [statusFilter, setStatusFilter] = useState<DisplayStatus | "all">("all");

  // Resync when the server-fetched `reviews` prop changes (e.g. after
  // router.refresh()) — useState's initial value only applies on mount.
  useEffect(() => {
    setLiveReviews(reviews);
  }, [reviews]);

  // Resyncs when the topbar's global search submits a new `?q=` while this
  // page is already mounted (router.push keeps the component instance, so
  // useState's initial value alone would miss the update).
  useEffect(() => {
    if (initialQuery !== undefined) setQuery(initialQuery);
  }, [initialQuery]);

  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return liveReviews
      .filter((review) => {
        const matchesQuery =
          q.length === 0 ||
          (review.reviewer_name ?? "").toLowerCase().includes(q) ||
          (review.review_text ?? "").toLowerCase().includes(q);
        return (
          matchesQuery &&
          (platformFilter === "all" || review.platform === platformFilter) &&
          (statusFilter === "all" || getDisplayStatus(review) === statusFilter)
        );
      })
      .sort((a, b) => crisisRank(a) - crisisRank(b));
  }, [liveReviews, query, platformFilter, statusFilter]);

  function handleReviewUpdate(updated: Review) {
    setLiveReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }

  const pendingCount = liveReviews.filter((r) => r.status === "pending").length;
  const flaggedCount = liveReviews.filter((r) => getDisplayStatus(r) === "flagged").length;
  const disputedCount = liveReviews.filter((r) => r.flagged_as_fake).length;

  if (!hasLocation) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/20 py-16 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10">
          <MapPin className="h-5 w-5 text-blue-600" />
        </span>
        <div>
          <p className="text-sm font-semibold">No location connected yet</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
            Connect your Google Business Profile to start pulling in reviews.
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)} className="mt-1 gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          Connect Google Business Profile
        </Button>
        <AddLocationModal open={modalOpen} onClose={() => setModalOpen(false)} googlePlacesEnabled={googlePlacesEnabled} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>{liveReviews.length} total reviews</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span>{pendingCount} pending</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span>{flaggedCount} flagged</span>
        {disputedCount > 0 && (
          <>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>{disputedCount} disputed as fake</span>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reviewer or keyword…"
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FilterPills options={PLATFORM_FILTERS} active={platformFilter} onChange={setPlatformFilter} />
          <FilterPills options={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} />
          <ExportReviewsButton reviews={filtered} />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-lg border bg-card py-12 text-center text-sm text-muted-foreground">
            {liveReviews.length === 0 ? "No reviews yet, check back soon." : "No reviews match your search or filters."}
          </div>
        ) : (
          filtered.map((review) => (
            <ReviewFeedCard key={review.id} review={review} onReviewUpdate={handleReviewUpdate} />
          ))
        )}
      </div>
    </div>
  );
}
