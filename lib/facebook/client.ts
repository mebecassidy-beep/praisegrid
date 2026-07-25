// Server-only OAuth-based client for a Facebook Page's reviews/recommendations.
// Unlike Google Business Profile, Meta's Graph API exposes no endpoint to post
// a reply to a Page rating - this integration is sync-only, never posts.
//
// Endpoint/version note: Meta has moved Pages between a classic 1-5 star
// "ratings" model and a thumbs up/down "recommendations" model over time, and
// which one a given Page returns depends on its own settings. This hasn't
// been exercised against a live Graph API response yet (needs an approved
// Facebook app, which this codebase doesn't have configured). Verify against
// https://developers.facebook.com/docs/graph-api/reference/page/ratings/
// before relying on this in production, and adjust field names if Meta has
// changed anything.

const GRAPH_BASE = "https://graph.facebook.com/v21.0";
const OAUTH_DIALOG_URL = "https://www.facebook.com/v21.0/dialog/oauth";

export const FACEBOOK_OAUTH_SCOPE = "pages_show_list,pages_read_engagement,pages_read_user_content";

export interface FacebookPage {
  id: string;
  name: string;
  accessToken: string;
}

export interface FacebookReview {
  reviewId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createTime: string;
}

export interface FacebookTokenResponse {
  accessToken: string;
  expiresAt: string | null;
}

function clientCredentials() {
  const clientId = process.env.FACEBOOK_OAUTH_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("FACEBOOK_OAUTH_CLIENT_ID / FACEBOOK_OAUTH_CLIENT_SECRET are not configured");
  }
  return { clientId, clientSecret };
}

export function isFacebookOAuthConfigured(): boolean {
  return Boolean(
    process.env.FACEBOOK_OAUTH_CLIENT_ID && process.env.FACEBOOK_OAUTH_CLIENT_SECRET && process.env.OAUTH_STATE_SECRET
  );
}

export function buildFacebookAuthUrl(redirectUri: string, state: string): string {
  const { clientId } = clientCredentials();
  const url = new URL(OAUTH_DIALOG_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", FACEBOOK_OAUTH_SCOPE);
  url.searchParams.set("response_type", "code");
  return url.toString();
}

/**
 * Exchanges an OAuth code for a short-lived user token, then immediately
 * upgrades it to a long-lived (~60 day) one. Facebook has no refresh_token
 * grant like Google's - Page tokens derived from a long-lived user token
 * (see listManagedPages) are what actually get stored, and Meta's docs say
 * those typically don't expire while the user keeps their Page role.
 */
export async function exchangeCodeForLongLivedToken(code: string, redirectUri: string): Promise<FacebookTokenResponse> {
  const { clientId, clientSecret } = clientCredentials();

  const shortLivedUrl = new URL(`${GRAPH_BASE}/oauth/access_token`);
  shortLivedUrl.searchParams.set("client_id", clientId);
  shortLivedUrl.searchParams.set("client_secret", clientSecret);
  shortLivedUrl.searchParams.set("redirect_uri", redirectUri);
  shortLivedUrl.searchParams.set("code", code);

  const shortLivedRes = await fetch(shortLivedUrl.toString());
  if (!shortLivedRes.ok) {
    const text = await shortLivedRes.text().catch(() => "");
    throw new Error(`Facebook token exchange failed: ${shortLivedRes.status} ${text}`);
  }
  const shortLived = await shortLivedRes.json();

  const longLivedUrl = new URL(`${GRAPH_BASE}/oauth/access_token`);
  longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
  longLivedUrl.searchParams.set("client_id", clientId);
  longLivedUrl.searchParams.set("client_secret", clientSecret);
  longLivedUrl.searchParams.set("fb_exchange_token", shortLived.access_token);

  const longLivedRes = await fetch(longLivedUrl.toString());
  if (!longLivedRes.ok) {
    const text = await longLivedRes.text().catch(() => "");
    throw new Error(`Facebook long-lived token exchange failed: ${longLivedRes.status} ${text}`);
  }
  const longLived = await longLivedRes.json();

  return {
    accessToken: longLived.access_token,
    expiresAt: longLived.expires_in ? new Date(Date.now() + longLived.expires_in * 1000).toISOString() : null,
  };
}

/** Pages the logged-in user manages, each with its own Page access token. */
export async function listManagedPages(userAccessToken: string): Promise<FacebookPage[]> {
  const url = new URL(`${GRAPH_BASE}/me/accounts`);
  url.searchParams.set("access_token", userAccessToken);
  url.searchParams.set("fields", "id,name,access_token");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Facebook me/accounts failed: ${res.status}`);
  const data = await res.json();
  return (data.data ?? []).map((p: any) => ({ id: p.id, name: p.name, accessToken: p.access_token }));
}

/** Fetches a Page's reviews/recommendations (single page of results - see file-level note on API uncertainty). */
export async function listPageReviews(pageId: string, pageAccessToken: string): Promise<FacebookReview[]> {
  const url = new URL(`${GRAPH_BASE}/${pageId}/ratings`);
  url.searchParams.set("access_token", pageAccessToken);
  url.searchParams.set("fields", "reviewer,rating,review_text,created_time,recommendation_type");
  url.searchParams.set("limit", "100");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Facebook ratings.list failed: ${res.status}`);
  const data = await res.json();

  return (data.data ?? []).map((r: any) => ({
    // The classic ratings edge doesn't return a stable top-level id per
    // rating - reviewer id + timestamp is the closest thing to one.
    reviewId: `${r.reviewer?.id ?? "anon"}:${r.created_time}`,
    reviewerName: r.reviewer?.name ?? "Anonymous",
    rating: typeof r.rating === "number" ? r.rating : r.recommendation_type === "positive" ? 5 : 1,
    comment: r.review_text ?? "",
    createTime: r.created_time,
  }));
}
