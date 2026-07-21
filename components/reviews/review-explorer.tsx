"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ReviewFeedCard } from "@/components/dashboard/review-feed-card";
import { FilterPills } from "@/components/shared/filter-pills";
import { FEED_REVIEWS, type FeedPlatform, type FeedStatus } from "@/lib/dashboard/mock-data";

const PLATFORM_FILTERS: { value: FeedPlatform | "all"; label: string }[] = [
  { value: "all", label: "All platforms" },
  { value: "google", label: "Google" },
  { value: "yelp", label: "Yelp" },
  { value: "facebook", label: "Facebook" },
];

const STATUS_FILTERS: { value: FeedStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "flagged", label: "Flagged" },
];

export function ReviewExplorer() {
  const [reviews, setReviews] = useState(FEED_REVIEWS);
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<FeedPlatform | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FeedStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesQuery =
        q.length === 0 ||
        review.reviewerName.toLowerCase().includes(q) ||
        review.reviewText.toLowerCase().includes(q);
      return (
        matchesQuery &&
        (platformFilter === "all" || review.platform === platformFilter) &&
        (statusFilter === "all" || review.status === statusFilter)
      );
    });
  }, [reviews, query, platformFilter, statusFilter]);

  function handleStatusChange(id: string, status: FeedStatus) {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)));
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const flaggedCount = reviews.filter((r) => r.status === "flagged").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>{reviews.length} total reviews</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span>{pendingCount} pending</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span>{flaggedCount} flagged</span>
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
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-lg border bg-card py-12 text-center text-sm text-muted-foreground">
            No reviews match your search or filters.
          </div>
        ) : (
          filtered.map((review) => (
            <ReviewFeedCard key={review.id} review={review} onStatusChange={handleStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}
