// Server-only OAuth-based client for the Google Business Profile API - full
// review history and real reply-posting, unlike the static-key Places API
// (lib/google-places/client.ts) which is read-only and capped at 5 reviews.
//
// Endpoint/version note: Google has reorganized this API family more than
// once (the legacy "Google My Business API v4" split into several REST APIs
// - Account Management, Business Information, Notifications, Verifications -
// review read/reply stayed under the original v4 host). The exact paths below
// haven't been exercised against a live Google response yet, since that
// requires an approved OAuth client this codebase doesn't have. Verify
// against https://developers.google.com/my-business/reference/rest before
// relying on this in production, and adjust if Google has moved anything.

const ACCOUNT_MANAGEMENT_BASE = "https://mybusinessaccountmanagement.googleapis.com/v1";
const REVIEWS_BASE = "https://mybusiness.googleapis.com/v4";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export const GBP_OAUTH_SCOPE = "https://www.googleapis.com/auth/business.manage";

export interface GbpAccount {
  name: string; // "accounts/{accountId}"
  accountName: string;
}

export interface GbpLocationRef {
  name: string; // "accounts/{accountId}/locations/{locationId}"
  title: string;
}

export interface GbpReview {
  reviewId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createTime: string;
  hasReply: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string;
  scope: string;
}

function clientCredentials() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET are not configured");
  }
  return { clientId, clientSecret };
}

export function isGbpOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET && process.env.OAUTH_STATE_SECRET
  );
}

/** Exchanges an OAuth authorization code (from the consent-screen redirect) for tokens. */
export async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
  const { clientId, clientSecret } = clientCredentials();

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    scope: data.scope,
  };
}

/** Google access tokens expire in ~1hr; exchanges a stored refresh token for a fresh one. */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const { clientId, clientSecret } = clientCredentials();

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token refresh failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    // Google doesn't always return a new refresh_token on refresh - callers
    // should keep the existing one when this comes back null.
    refreshToken: data.refresh_token ?? null,
    expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    scope: data.scope,
  };
}

export async function listAccounts(accessToken: string): Promise<GbpAccount[]> {
  const res = await fetch(`${ACCOUNT_MANAGEMENT_BASE}/accounts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`GBP accounts.list failed: ${res.status}`);
  const data = await res.json();
  return data.accounts ?? [];
}

export async function listLocationsForAccount(accessToken: string, accountName: string): Promise<GbpLocationRef[]> {
  const url = new URL(`${REVIEWS_BASE}/${accountName}/locations`);
  url.searchParams.set("pageSize", "100");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`GBP locations.list failed: ${res.status}`);
  const data = await res.json();
  return (data.locations ?? []).map((l: any) => ({ name: l.name, title: l.locationName ?? l.title ?? "" }));
}

const STAR_RATING_TO_NUMBER: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

/** Fetches one page of a location's full review history (paginated, unlike the 5-review Places API cap). */
export async function listReviews(
  accessToken: string,
  accountId: string,
  gbpLocationId: string,
  pageToken?: string
): Promise<{ reviews: GbpReview[]; nextPageToken: string | null }> {
  const url = new URL(`${REVIEWS_BASE}/accounts/${accountId}/locations/${gbpLocationId}/reviews`);
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`GBP reviews.list failed: ${res.status}`);
  const data = await res.json();

  const reviews: GbpReview[] = (data.reviews ?? []).map((r: any) => ({
    reviewId: r.reviewId,
    reviewerName: r.reviewer?.displayName ?? "Anonymous",
    rating: STAR_RATING_TO_NUMBER[r.starRating] ?? 0,
    comment: r.comment ?? "",
    createTime: r.createTime,
    hasReply: Boolean(r.reviewReply),
  }));

  return { reviews, nextPageToken: data.nextPageToken ?? null };
}

/** Posts (or replaces) the owner reply on a review - this is what makes "Approve response" real. */
export async function replyToReview(
  accessToken: string,
  accountId: string,
  gbpLocationId: string,
  reviewId: string,
  comment: string
): Promise<void> {
  const url = `${REVIEWS_BASE}/accounts/${accountId}/locations/${gbpLocationId}/reviews/${reviewId}/reply`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GBP reviews.reply failed: ${res.status} ${text}`);
  }
}
