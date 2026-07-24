import type { SupabaseClient } from "@supabase/supabase-js";
import { getActiveConnection } from "@/lib/google-business-profile/connection";
import { listReviews, type GbpReview } from "@/lib/google-business-profile/client";
import { classifyReviewRisk } from "@/lib/reviews/classify-risk";
import { sendCrisisAlertSms } from "@/lib/sms/send-crisis-alert";
import { hasProAccess } from "@/lib/subscription";
import type { Database } from "@/types/database";
import type { SyncResult } from "@/lib/google-places/sync-reviews";

// Reviews discovered through the GBP API are stored with this prefix so
// reply-posting can tell them apart from Places-API-synced reviews (see
// app/api/reviews/[id]/route.ts) - a Places API review's ID isn't valid
// against the GBP reply endpoint, they're two different Google APIs with
// their own ID spaces for what might be the same underlying review.
export const GBP_EXTERNAL_ID_PREFIX = "gbp:";

const RECENT_WINDOW_MS = 1000 * 60 * 60 * 24 * 3;
const MAX_PAGES = 20; // guard against runaway pagination on a single cron run

/**
 * Full-history sync for a location with an active Google Business Profile
 * OAuth connection - unlike the Places-API sync (capped at 5 most recent),
 * this paginates through the location's entire review history.
 */
export async function syncGbpReviewsForLocation(
  location: { id: string; name: string; user_id: string },
  supabase: SupabaseClient<Database>
): Promise<SyncResult | null> {
  const connection = await getActiveConnection(supabase, location.id);
  if (!connection) return null;

  try {
    let newReviews = 0;
    let pageToken: string | null | undefined = undefined;
    let pages = 0;

    do {
      const page = await listReviews(connection.accessToken, connection.accountId, connection.gbpLocationId, pageToken ?? undefined);
      pages += 1;

      for (const review of page.reviews) {
        const inserted = await upsertReview(supabase, location.id, review);
        if (!inserted) continue;
        newReviews += 1;

        const riskLevel = classifyReviewRisk(review.rating, review.comment);
        const isRecent = Date.now() - new Date(review.createTime).getTime() < RECENT_WINDOW_MS;
        if (riskLevel === "high" && isRecent) {
          await maybeSendCrisisAlert(supabase, location, review);
        }
      }

      pageToken = page.nextPageToken;
    } while (pageToken && pages < MAX_PAGES);

    return { locationId: location.id, locationName: location.name, newReviews, error: null };
  } catch (err: any) {
    return { locationId: location.id, locationName: location.name, newReviews: 0, error: err?.message || "Sync failed" };
  }
}

async function upsertReview(
  supabase: SupabaseClient<Database>,
  locationId: string,
  review: GbpReview
): Promise<boolean> {
  const riskLevel = classifyReviewRisk(review.rating, review.comment);

  const { data: inserted, error } = await (supabase.from("reviews") as any)
    .upsert(
      {
        location_id: locationId,
        platform: "google",
        external_review_id: `${GBP_EXTERNAL_ID_PREFIX}${review.reviewId}`,
        reviewer_name: review.reviewerName,
        rating: review.rating,
        review_text: review.comment,
        review_date: review.createTime,
        risk_level: riskLevel,
        flagged_at: riskLevel ? new Date().toISOString() : null,
        // A review the owner already replied to directly in Google (outside
        // Praisegrid) shouldn't show up as pending here.
        status: review.hasReply ? "posted" : "pending",
      },
      { onConflict: "location_id,platform,external_review_id", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(`GBP review sync upsert failed for location ${locationId}:`, error);
    return false;
  }
  return Boolean(inserted);
}

async function maybeSendCrisisAlert(
  supabase: SupabaseClient<Database>,
  location: { id: string; name: string; user_id: string },
  review: GbpReview
) {
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("subscription_tier, alert_phone_number, company_name")
    .eq("id", location.user_id)
    .single();

  if (hasProAccess(profile?.subscription_tier) && profile?.alert_phone_number) {
    sendCrisisAlertSms({
      to: profile.alert_phone_number,
      businessName: profile.company_name || location.name,
      reviewText: review.comment || null,
    }).catch(console.error);
  }
}
