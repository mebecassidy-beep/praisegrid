import type { SupabaseClient } from "@supabase/supabase-js";
import { getActiveFacebookConnection } from "@/lib/facebook/connection";
import { listPageReviews, type FacebookReview } from "@/lib/facebook/client";
import { classifyReviewRisk } from "@/lib/reviews/classify-risk";
import { sendCrisisAlertSms } from "@/lib/sms/send-crisis-alert";
import { hasProAccess } from "@/lib/subscription";
import type { Database } from "@/types/database";
import type { SyncResult } from "@/lib/google-places/sync-reviews";

// Reviews discovered through Facebook are stored with this prefix so the
// reply-posting path (app/api/reviews/[id]/route.ts) knows never to attempt
// a real post for them - Meta's Graph API has no endpoint for that, unlike
// the "gbp:" prefix which does support a real reply.
export const FACEBOOK_EXTERNAL_ID_PREFIX = "fb:";

const RECENT_WINDOW_MS = 1000 * 60 * 60 * 24 * 3;

export async function syncFacebookReviewsForLocation(
  location: { id: string; name: string; user_id: string },
  supabase: SupabaseClient<Database>
): Promise<SyncResult | null> {
  const connection = await getActiveFacebookConnection(supabase, location.id);
  if (!connection) return null;

  try {
    const reviews = await listPageReviews(connection.pageId, connection.pageAccessToken);

    let newReviews = 0;
    for (const review of reviews) {
      const inserted = await upsertReview(supabase, location.id, review);
      if (!inserted) continue;
      newReviews += 1;

      const riskLevel = classifyReviewRisk(review.rating, review.comment);
      const isRecent = Date.now() - new Date(review.createTime).getTime() < RECENT_WINDOW_MS;
      if (riskLevel === "high" && isRecent) {
        await maybeSendCrisisAlert(supabase, location, review);
      }
    }

    return { locationId: location.id, locationName: location.name, newReviews, error: null };
  } catch (err: any) {
    return { locationId: location.id, locationName: location.name, newReviews: 0, error: err?.message || "Sync failed" };
  }
}

async function upsertReview(
  supabase: SupabaseClient<Database>,
  locationId: string,
  review: FacebookReview
): Promise<boolean> {
  const riskLevel = classifyReviewRisk(review.rating, review.comment);

  const { data: inserted, error } = await (supabase.from("reviews") as any)
    .upsert(
      {
        location_id: locationId,
        platform: "facebook",
        external_review_id: `${FACEBOOK_EXTERNAL_ID_PREFIX}${review.reviewId}`,
        reviewer_name: review.reviewerName,
        rating: review.rating,
        review_text: review.comment,
        review_date: review.createTime,
        risk_level: riskLevel,
        flagged_at: riskLevel ? new Date().toISOString() : null,
        status: "pending",
      },
      { onConflict: "location_id,platform,external_review_id", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(`Facebook review sync upsert failed for location ${locationId}:`, error);
    return false;
  }
  return Boolean(inserted);
}

async function maybeSendCrisisAlert(
  supabase: SupabaseClient<Database>,
  location: { id: string; name: string; user_id: string },
  review: FacebookReview
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
