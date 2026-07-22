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

/**
 * Returns a competitor's public rating/review count for the weekly
 * competitor-gap report.
 *
 * Placeholder implementation: deterministic, hash-derived numbers, same
 * idiom as lib/business-scan/get-business-scan.ts. Swap this function's body
 * for a real Google Places API call (Find Place + Place Details) once a
 * GOOGLE_PLACES_API_KEY is configured — the shape here is already what a real
 * lookup should produce, so no caller needs to change.
 */
export async function getCompetitorSnapshot(competitorName: string): Promise<CompetitorSnapshot> {
  const seed = hashString(competitorName.toLowerCase());

  const rating = Math.round((3.6 + ((seed % 130) / 100)) * 10) / 10; // 3.6–4.9
  const reviewCount = 25 + (seed % 300);

  return {
    competitorName,
    rating,
    reviewCount,
    isRealData: false,
  };
}
