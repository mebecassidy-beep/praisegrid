import { computeLiveScore, isGooglePlacesConfigured, searchBusinessByName } from "@/lib/google-places/client";

export interface BusinessScanInput {
  businessName: string;
  city?: string;
}

export interface BusinessScanResult {
  businessName: string;
  currentRating: number | null;
  reviewCount: number | null;
  reputationScore: number;
  recentComplaintSnippet: string | null;
  estimatedLostCustomers: number;
  isRealData: boolean;
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function mockScan({ businessName, city }: BusinessScanInput): BusinessScanResult {
  const seed = hashString(`${businessName.toLowerCase()}|${city?.toLowerCase() ?? ""}`);

  const currentRating = Math.round((3.4 + ((seed % 130) / 100)) * 10) / 10; // 3.4–4.7
  const reviewCount = 18 + (seed % 240);
  const reputationScore = 41 + (seed % 34); // deliberately mediocre — this is the "before" state
  const estimatedLostCustomers = 6 + ((seed >> 7) % 38);

  return {
    businessName,
    currentRating,
    reviewCount,
    reputationScore,
    recentComplaintSnippet: null,
    estimatedLostCustomers,
    isRealData: false,
  };
}

/**
 * Returns a business's current review stats. If GOOGLE_PLACES_API_KEY is
 * configured and the business name resolves to a real Google listing, this
 * returns real rating/review data with a formula-based lost-customer
 * estimate. Otherwise falls back to a deterministic, clearly-labeled
 * benchmark estimate (isRealData: false) — never fabricated as real.
 */
export async function getBusinessScan({ businessName, city }: BusinessScanInput): Promise<BusinessScanResult> {
  if (isGooglePlacesConfigured() && businessName.trim() && businessName.trim() !== "Your Business") {
    try {
      const query = city ? `${businessName} ${city}` : businessName;
      const details = await searchBusinessByName(query);

      if (details && (details.rating != null || details.userRatingCount != null)) {
        const live = computeLiveScore(details);
        return {
          businessName: details.name,
          currentRating: details.rating,
          reviewCount: details.userRatingCount,
          reputationScore: live.score,
          recentComplaintSnippet: live.recentNegativeReviews[0]?.text ?? null,
          estimatedLostCustomers: live.estimatedLostCustomers,
          isRealData: true,
        };
      }
    } catch (error) {
      console.error("Error resolving real business scan, falling back to estimate:", error);
    }
  }

  return mockScan({ businessName, city });
}
