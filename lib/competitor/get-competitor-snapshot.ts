import { isGooglePlacesConfigured, searchBusinessByName } from "@/lib/google-places/client";

export interface CompetitorSnapshot {
  competitorName: string;
  rating: number;
  reviewCount: number;
  isRealData: boolean;
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function mockSnapshot(competitorName: string): CompetitorSnapshot {
  const seed = hashString(competitorName.toLowerCase());
  return {
    competitorName,
    rating: Math.round((3.6 + ((seed % 130) / 100)) * 10) / 10, // 3.6–4.9
    reviewCount: 25 + (seed % 300),
    isRealData: false,
  };
}

/**
 * Returns a competitor's public rating/review count. Uses a real Google
 * Places text-search lookup when GOOGLE_PLACES_API_KEY is configured;
 * otherwise falls back to a deterministic, clearly-labeled (isRealData:
 * false) estimate so callers never present invented numbers about a real
 * named business as fact.
 */
export async function getCompetitorSnapshot(competitorName: string): Promise<CompetitorSnapshot> {
  if (isGooglePlacesConfigured()) {
    try {
      const details = await searchBusinessByName(competitorName);
      if (details && details.rating != null && details.userRatingCount != null) {
        return {
          competitorName: details.name,
          rating: details.rating,
          reviewCount: details.userRatingCount,
          isRealData: true,
        };
      }
    } catch (error) {
      console.error("Error resolving competitor snapshot, falling back to estimate:", error);
    }
  }

  return mockSnapshot(competitorName);
}
