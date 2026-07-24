import type { SupabaseClient } from "@supabase/supabase-js";
import { getPlaceDetails, type PlaceReview } from "@/lib/google-places/client";
import { classifyReviewRisk } from "@/lib/reviews/classify-risk";
import { sendCrisisAlertSms } from "@/lib/sms/send-crisis-alert";
import { hasProAccess } from "@/lib/subscription";
import type { Database } from "@/types/database";

export interface SyncResult {
  locationId: string;
  locationName: string;
  newReviews: number;
  error: string | null;
}

// Google review resource names (places/{placeId}/reviews/{reviewId}) should
// always be present, this only fires if that ever changes shape - keeps sync
// working (just less precisely deduped against edits) instead of crashing.
function fallbackExternalId(review: PlaceReview): string {
  return `fallback:${review.authorName}:${review.rating}:${review.text.slice(0, 40)}`;
}

// Only alert on reviews published within this window. Places API only ever
// returns up to 5 reviews per place, but the first sync for a newly-connected
// location could still surface reviews that are months old - without this,
// connecting a location with an old 1-star review would fire a crisis SMS for
// something the owner already knows about and dealt with long ago.
const RECENT_WINDOW_MS = 1000 * 60 * 60 * 24 * 3;

/**
 * Pulls a location's current Google reviews (Places API, capped at 5 most
 * recent by Google's own API design) and upserts any not already present,
 * keyed by external_review_id so repeated syncs never duplicate a row.
 * Reuses the same risk classification and crisis-SMS path as the manual/
 * webhook review-ingestion endpoint (app/api/reviews/route.ts) for parity.
 */
export async function syncGoogleReviewsForLocation(
  location: { id: string; name: string; google_place_id: string; user_id: string },
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    const details = await getPlaceDetails(location.google_place_id);
    let newReviews = 0;

    for (const review of details.reviews) {
      const externalId = review.id || fallbackExternalId(review);
      const reviewDate = review.publishTime ?? new Date().toISOString();
      const riskLevel = classifyReviewRisk(review.rating, review.text);

      const { data: inserted, error } = await (supabase.from("reviews") as any)
        .upsert(
          {
            location_id: location.id,
            platform: "google",
            external_review_id: externalId,
            reviewer_name: review.authorName,
            rating: review.rating,
            review_text: review.text,
            review_date: reviewDate,
            risk_level: riskLevel,
            flagged_at: riskLevel ? new Date().toISOString() : null,
          },
          { onConflict: "location_id,platform,external_review_id", ignoreDuplicates: true }
        )
        .select("id")
        .maybeSingle();

      if (error) {
        console.error(`Google review sync upsert failed for location ${location.id}:`, error);
        continue;
      }

      // ignoreDuplicates means `inserted` comes back null for a row that
      // already existed - only count and alert on genuinely new reviews.
      if (!inserted) continue;
      newReviews += 1;

      const isRecent = Date.now() - new Date(reviewDate).getTime() < RECENT_WINDOW_MS;
      if (riskLevel === "high" && isRecent) {
        const { data: profile } = await (supabase.from("profiles") as any)
          .select("subscription_tier, alert_phone_number, company_name")
          .eq("id", location.user_id)
          .single();

        if (hasProAccess(profile?.subscription_tier) && profile?.alert_phone_number) {
          sendCrisisAlertSms({
            to: profile.alert_phone_number,
            businessName: profile.company_name || location.name,
            reviewText: review.text || null,
          }).catch(console.error);
        }
      }
    }

    return { locationId: location.id, locationName: location.name, newReviews, error: null };
  } catch (err: any) {
    return {
      locationId: location.id,
      locationName: location.name,
      newReviews: 0,
      error: err?.message || "Sync failed",
    };
  }
}
