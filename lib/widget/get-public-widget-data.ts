import { createServiceRoleClient } from "@/lib/supabase/server";

export interface PublicWidgetReview {
  id: string;
  reviewerName: string | null;
  rating: number;
  text: string;
}

export interface PublicWidgetData {
  businessName: string;
  avgRating: number;
  totalReviews: number;
  reviews: PublicWidgetReview[];
}

/**
 * Reads a location's public-safe review summary for the unauthenticated
 * widget.js embed. Uses the service-role client deliberately - a visitor on
 * some third-party site has no Supabase session, and reviews/locations have
 * no anon-select RLS policy by design, so the normal request-scoped client
 * would always return null here (same reasoning as getPublicLocation for the
 * /feedback capture page).
 *
 * Rating/review-count are computed across every review at the location
 * (matches the real public rating shown on Google), the quoted snippets are
 * limited to 4-5 star reviews with written text - the same review text is
 * already public on the source platform, this just doesn't parade a 1-star
 * complaint on the business's own site.
 */
export async function getPublicWidgetData(locationId: string): Promise<PublicWidgetData | null> {
  const supabase = createServiceRoleClient();

  const { data: location } = await (supabase.from("locations") as any)
    .select("id, name")
    .eq("id", locationId)
    .single();

  if (!location) return null;

  const { data: reviews } = await (supabase.from("reviews") as any)
    .select("id, reviewer_name, rating, review_text")
    .eq("location_id", locationId);

  const allReviews: { id: string; reviewer_name: string | null; rating: number; review_text: string | null }[] =
    reviews ?? [];

  const totalReviews = allReviews.length;
  const avgRating =
    totalReviews === 0 ? 0 : Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10;

  const snippetReviews = allReviews
    .filter((r) => r.rating >= 4 && !!r.review_text)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)
    .map((r) => ({ id: r.id, reviewerName: r.reviewer_name, rating: r.rating, text: r.review_text as string }));

  return {
    businessName: location.name,
    avgRating,
    totalReviews,
    reviews: snippetReviews,
  };
}
