import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Location, Review, Profile } from "@/types";
import type { Database } from "@/types/database";

export interface LocationMetric {
  avgRating: number;
  reviewCount: number;
  responseRate: number;
  pendingCount: number;
}

export interface DashboardData {
  locations: Location[];
  reviews: Review[];
  totalReviews: number;
  avgRating: number;
  responseRate: number;
  pendingCount: number;
  ratingDistribution: { stars: number; count: number }[];
  locationMetrics: Record<string, LocationMetric>;
  monthlyRatingTrend: { month: string; avgRating: number; reviewCount: number }[];
  healthScore: number | null;
}

/**
 * Weighted 0-100 reputation health score: 40% normalized average rating,
 * 35% response rate, 25% inverse-pending penalty (more unanswered reviews
 * pulls the score down). Returns null when there's no review history yet —
 * a fabricated score for zero data would be misleading, not honest.
 */
function computeHealthScore(overall: LocationMetric): number | null {
  if (overall.reviewCount === 0) return null;

  const ratingComponent = (overall.avgRating / 5) * 100;
  const responseComponent = overall.responseRate;
  const pendingPenalty = 100 - Math.min(overall.pendingCount * 5, 100);

  const score = ratingComponent * 0.4 + responseComponent * 0.35 + pendingPenalty * 0.25;
  return Math.round(Math.min(100, Math.max(0, score)));
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function computeLocationMetric(reviews: Review[]): LocationMetric {
  if (reviews.length === 0) {
    return { avgRating: 0, reviewCount: 0, responseRate: 0, pendingCount: 0 };
  }
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const responded = reviews.filter((r) => !!r.response_text).length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return {
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
    responseRate: Math.round((responded / reviews.length) * 100),
    pendingCount,
  };
}

/**
 * Fetches the signed-in user's billing/onboarding profile row — kept separate
 * from getDashboardData (which is scoped to locations+reviews) since it backs
 * the dashboard shell chrome (tier badge, onboarding modal) rather than page content.
 */
export async function getProfile(
  userId: string,
  supabase: SupabaseClient<Database> = createClient()
): Promise<Pick<Profile, "email" | "subscription_tier" | "onboarding_completed_at" | "report_frequency">> {
  const { data } = await (supabase.from("profiles") as any)
    .select("email, subscription_tier, onboarding_completed_at, report_frequency")
    .eq("id", userId)
    .single();

  return (
    data ?? { email: "", subscription_tier: "free", onboarding_completed_at: null, report_frequency: "weekly" }
  );
}

/**
 * Fetches every location + review the signed-in user owns and computes the
 * aggregates the dashboard/locations/analytics pages need. Scoped by RLS
 * (locations.user_id = auth.uid()) via the request-scoped Supabase client.
 */
export async function getDashboardData(
  userId: string,
  supabase: SupabaseClient<Database> = createClient()
): Promise<DashboardData> {
  const { data: locations } = await (supabase.from("locations") as any)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  const locationList: Location[] = locations ?? [];
  const locationIds = locationList.map((l) => l.id);

  let reviewList: Review[] = [];
  if (locationIds.length > 0) {
    const { data: reviews } = await (supabase.from("reviews") as any)
      .select("*")
      .in("location_id", locationIds)
      .order("review_date", { ascending: false, nullsFirst: false });
    reviewList = reviews ?? [];
  }

  const overall = computeLocationMetric(reviewList);

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviewList.filter((r) => r.rating === stars).length,
  }));

  const locationMetrics: Record<string, LocationMetric> = {};
  for (const location of locationList) {
    locationMetrics[location.id] = computeLocationMetric(
      reviewList.filter((r) => r.location_id === location.id)
    );
  }

  const monthBuckets = new Map<string, Review[]>();
  for (const review of reviewList) {
    if (!review.review_date) continue;
    const date = new Date(review.review_date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthBuckets.has(key)) monthBuckets.set(key, []);
    monthBuckets.get(key)!.push(review);
  }
  const monthlyRatingTrend = Array.from(monthBuckets.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .slice(-6)
    .map(([key, reviews]) => {
      const [, monthIndex] = key.split("-").map(Number);
      return {
        month: MONTH_LABELS[monthIndex],
        avgRating: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10,
        reviewCount: reviews.length,
      };
    });

  return {
    locations: locationList,
    reviews: reviewList,
    totalReviews: overall.reviewCount,
    avgRating: overall.avgRating,
    responseRate: overall.responseRate,
    pendingCount: overall.pendingCount,
    ratingDistribution,
    locationMetrics,
    monthlyRatingTrend,
    healthScore: computeHealthScore(overall),
  };
}
