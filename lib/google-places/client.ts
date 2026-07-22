// Server-only wrapper around the Google Places API (New). Never import this
// from a client component — GOOGLE_PLACES_API_KEY must stay server-side.
// Gated on env var presence, matching the sendEmail()/resend.ts pattern:
// callers check isGooglePlacesConfigured() and fall back gracefully instead
// of throwing when the key isn't set yet.

const PLACES_BASE = "https://places.googleapis.com/v1";

export interface PlaceSuggestion {
  placeId: string;
  description: string;
}

export interface PlaceReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  rating: number | null;
  userRatingCount: number | null;
  reviews: PlaceReview[];
}

export function isGooglePlacesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

function apiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not configured");
  return key;
}

export async function autocompleteBusiness(input: string): Promise<PlaceSuggestion[]> {
  const res = await fetch(`${PLACES_BASE}/places:autocomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
    },
    body: JSON.stringify({
      input,
      includedPrimaryTypes: ["establishment"],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Places autocomplete failed: ${res.status}`);
  }

  const data = await res.json();
  const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];

  return suggestions
    .map((s: any) => s.placePrediction)
    .filter(Boolean)
    .map((p: any) => ({
      placeId: p.placeId,
      description: p.text?.text ?? "",
    }));
}

/** Resolves a free-text business name to its Place Details via Text Search — used
 * where we only have a typed name (e.g. the exit-intent lead form), not a placeId
 * from autocomplete selection. Returns null if nothing matches. */
export async function searchBusinessByName(query: string): Promise<PlaceDetails | null> {
  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.reviews",
    },
    body: JSON.stringify({ textQuery: query, pageSize: 1 }),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  const place = Array.isArray(data.places) ? data.places[0] : null;
  if (!place) return null;

  const reviews: PlaceReview[] = Array.isArray(place.reviews)
    ? place.reviews.slice(0, 5).map((r: any) => ({
        authorName: r.authorAttribution?.displayName ?? "Anonymous",
        rating: typeof r.rating === "number" ? r.rating : 0,
        text: (r.text?.text ?? "").slice(0, 400),
        relativeTime: r.relativePublishTimeDescription ?? "",
      }))
    : [];

  return {
    placeId: place.id,
    name: place.displayName?.text ?? query,
    formattedAddress: place.formattedAddress ?? "",
    rating: typeof place.rating === "number" ? place.rating : null,
    userRatingCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
    reviews,
  };
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const res = await fetch(`${PLACES_BASE}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask": "id,displayName,formattedAddress,rating,userRatingCount,reviews",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Place details failed: ${res.status}`);
  }

  const data = await res.json();

  const reviews: PlaceReview[] = Array.isArray(data.reviews)
    ? data.reviews.slice(0, 5).map((r: any) => ({
        authorName: r.authorAttribution?.displayName ?? "Anonymous",
        rating: typeof r.rating === "number" ? r.rating : 0,
        text: (r.text?.text ?? "").slice(0, 400),
        relativeTime: r.relativePublishTimeDescription ?? "",
      }))
    : [];

  return {
    placeId: data.id ?? placeId,
    name: data.displayName?.text ?? "Your Business",
    formattedAddress: data.formattedAddress ?? "",
    rating: typeof data.rating === "number" ? data.rating : null,
    userRatingCount: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    reviews,
  };
}

export interface LiveScoreResult {
  score: number;
  factors: { label: string; value: number }[];
  recentNegativeReviews: PlaceReview[];
  estimatedLostCustomers: number;
}

const LOST_CUSTOMER_RATE = 0.12;

/**
 * Turns real Google data into a 0-100 "AI Visibility Score" and supporting
 * factors. Every input here is a real, publicly-returned Places field —
 * nothing about a specific business is invented. estimatedLostCustomers is
 * an explicit formula-based estimate (same disclosed-estimate pattern used
 * by the on-page ROI calculator), not a measured fact.
 */
export function computeLiveScore(details: PlaceDetails): LiveScoreResult {
  const rating = details.rating ?? 0;
  const count = details.userRatingCount ?? 0;

  const ratingFactor = Math.round((rating / 5) * 60);
  const volumeFactor = Math.round(Math.min(count, 200) / 200 * 25);

  const recentNegativeReviews = details.reviews.filter((r) => r.rating > 0 && r.rating <= 3);
  const sentimentPenalty = Math.min(15, recentNegativeReviews.length * 5);
  const sentimentFactor = Math.max(0, 15 - sentimentPenalty);

  const score = Math.min(100, Math.max(0, ratingFactor + volumeFactor + sentimentFactor));

  const estimatedLostCustomers = Math.round(Math.max(count, 20) * 0.4 * LOST_CUSTOMER_RATE);

  return {
    score,
    factors: [
      { label: "Rating strength", value: Math.round((rating / 5) * 100) },
      { label: "Review volume vs. local norm", value: Math.round(Math.min(count, 200) / 200 * 100) },
      { label: "Recent review sentiment", value: Math.round((sentimentFactor / 15) * 100) },
    ],
    recentNegativeReviews,
    estimatedLostCustomers,
  };
}
