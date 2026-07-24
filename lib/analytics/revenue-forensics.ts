import type { Review } from "@/types";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type ForensicsReview = Pick<Review, "rating" | "status" | "review_date" | "created_at" | "responded_at">;

/**
 * A "rescued" review is a negative (<=2 star) review whose owner-approved
 * response has actually gone out. Rating and status/responded_at all come
 * straight off the reviews table - this is a filter, not an estimate.
 */
export function isRescuedReview(review: ForensicsReview): boolean {
  return review.rating <= 2 && review.status === "posted" && !!review.responded_at;
}

/**
 * Milliseconds between when a review appeared (review_date, falling back to
 * our own ingestion created_at if the platform didn't supply one) and when
 * the owner's response actually posted. Null if there's no response yet.
 */
export function responseTimeMs(review: ForensicsReview): number | null {
  if (!review.responded_at) return null;
  const start = review.review_date ?? review.created_at;
  const ms = new Date(review.responded_at).getTime() - new Date(start).getTime();
  return Number.isFinite(ms) && ms >= 0 ? ms : null;
}

/** Formats a duration for display, picking the coarsest unit that stays readable (e.g. "48s", "12m", "3h 15m", "2d 4h"). */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const totalMinutes = Math.round(ms / 60_000);
  if (totalMinutes < 60) return `${totalMinutes}m`;

  const totalHours = Math.floor(ms / 3_600_000);
  const remMinutes = Math.round((ms % 3_600_000) / 60_000);
  if (totalHours < 24) return remMinutes > 0 ? `${totalHours}h ${remMinutes}m` : `${totalHours}h`;

  const totalDays = Math.floor(ms / 86_400_000);
  const remHours = Math.round((ms % 86_400_000) / 3_600_000);
  return remHours > 0 ? `${totalDays}d ${remHours}h` : `${totalDays}d`;
}

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}`;
}

export interface RevenueForensicsResult {
  hasAnyRescuedReview: boolean;
  rescuedThisMonth: number;
  revenueRescuedThisMonth: number;
  estimatedCustomerValue: number;
  avgResponseTimeMs: number | null;
  avgResponseTimeLabel: string | null;
  monthlyRecovery: { month: string; count: number }[];
}

/**
 * Pure aggregation over already-fetched reviews - no DB access here, so it's
 * easy to reason about (and test) independently of Supabase. Every number in
 * the result is derived from real rows except revenueRescuedThisMonth, which
 * is rescuedThisMonth * estimatedCustomerValue - an owner-set assumption,
 * not a measured fact. Callers must surface that distinction in the UI
 * rather than presenting the dollar figure as precisely measured.
 */
export function computeRevenueForensics(
  reviews: ForensicsReview[],
  estimatedCustomerValue: number
): RevenueForensicsResult {
  const rescued = reviews.filter(isRescuedReview);

  if (rescued.length === 0) {
    return {
      hasAnyRescuedReview: false,
      rescuedThisMonth: 0,
      revenueRescuedThisMonth: 0,
      estimatedCustomerValue,
      avgResponseTimeMs: null,
      avgResponseTimeLabel: null,
      monthlyRecovery: [],
    };
  }

  const thisMonthKey = currentMonthKey();
  const rescuedThisMonth = rescued.filter((r) => monthKey(r.responded_at!) === thisMonthKey).length;

  const responseTimes = rescued
    .map(responseTimeMs)
    .filter((ms): ms is number => ms !== null);
  const avgResponseTimeMs =
    responseTimes.length > 0
      ? responseTimes.reduce((sum, ms) => sum + ms, 0) / responseTimes.length
      : null;

  const monthBuckets = new Map<string, number>();
  for (const review of rescued) {
    const key = monthKey(review.responded_at!);
    monthBuckets.set(key, (monthBuckets.get(key) ?? 0) + 1);
  }
  const sortedKeys = Array.from(monthBuckets.keys())
    .sort((a, b) => (a > b ? 1 : -1))
    .slice(-6);
  const monthlyRecovery = sortedKeys.map((key) => {
    const [, monthIndex] = key.split("-").map(Number);
    return { month: MONTH_LABELS[monthIndex], count: monthBuckets.get(key)! };
  });

  return {
    hasAnyRescuedReview: true,
    rescuedThisMonth,
    revenueRescuedThisMonth: rescuedThisMonth * estimatedCustomerValue,
    estimatedCustomerValue,
    avgResponseTimeMs,
    avgResponseTimeLabel: avgResponseTimeMs !== null ? formatDuration(avgResponseTimeMs) : null,
    monthlyRecovery,
  };
}

export interface ResponseTimeTrendPoint {
  month: string;
  avgResponseTimeMs: number;
}

/** Monthly avg response time across ALL responded reviews (any rating) - a general responsiveness trend, distinct from the negative-review-focused revenue forensics above. */
export function computeResponseTimeTrend(reviews: ForensicsReview[], months = 6): ResponseTimeTrendPoint[] {
  const responded = reviews.filter((r) => r.responded_at);
  const monthBuckets = new Map<string, number[]>();
  for (const review of responded) {
    const ms = responseTimeMs(review);
    if (ms === null) continue;
    const key = monthKey(review.responded_at!);
    if (!monthBuckets.has(key)) monthBuckets.set(key, []);
    monthBuckets.get(key)!.push(ms);
  }
  const sortedKeys = Array.from(monthBuckets.keys())
    .sort((a, b) => (a > b ? 1 : -1))
    .slice(-months);
  return sortedKeys.map((key) => {
    const [, monthIndex] = key.split("-").map(Number);
    const times = monthBuckets.get(key)!;
    return {
      month: MONTH_LABELS[monthIndex],
      avgResponseTimeMs: times.reduce((s, ms) => s + ms, 0) / times.length,
    };
  });
}
