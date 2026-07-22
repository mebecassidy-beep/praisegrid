// Shared builders for the public "leave a review" deep links so the blast
// route, the feedback-shield capture page, and the QR/table-tent hub all
// point to the exact same URLs instead of re-deriving the format.

export function buildGoogleReviewLink(googlePlaceId: string): string {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(googlePlaceId)}`;
}

export function buildYelpReviewLink(yelpBusinessId: string): string {
  return `https://www.yelp.com/writeareview/biz/${encodeURIComponent(yelpBusinessId)}`;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function buildFeedbackShieldLink(locationId: string): string {
  return `${siteUrl()}/feedback/${locationId}`;
}
