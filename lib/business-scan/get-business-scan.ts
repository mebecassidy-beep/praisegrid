export interface BusinessScanInput {
  businessName: string;
  city?: string;
}

export interface BusinessScanResult {
  businessName: string;
  currentRating: number;
  reviewCount: number;
  reputationScore: number;
  unansweredReviews: number;
  unclaimedQuestions: number;
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

/**
 * Returns a business's current review stats.
 *
 * Placeholder implementation: deterministic, hash-derived numbers so the same
 * business name always renders the same "scan" result. Swap this function's
 * body for a real Google Places API call (Find Place + Place Details) once a
 * GOOGLE_PLACES_API_KEY is configured — the input/output shape here is already
 * what the real lookup should produce, so no caller needs to change.
 */
export async function getBusinessScan({
  businessName,
  city,
}: BusinessScanInput): Promise<BusinessScanResult> {
  const seed = hashString(`${businessName.toLowerCase()}|${city?.toLowerCase() ?? ""}`);

  const currentRating = Math.round((3.4 + ((seed % 130) / 100)) * 10) / 10; // 3.4–4.7
  const reviewCount = 18 + (seed % 240);
  const reputationScore = 41 + (seed % 34); // deliberately mediocre — this is the "before" state
  const unansweredReviews = 3 + ((seed >> 3) % 22);
  const unclaimedQuestions = 1 + ((seed >> 5) % 6);
  const estimatedLostCustomers = 6 + ((seed >> 7) % 38);

  return {
    businessName,
    currentRating,
    reviewCount,
    reputationScore,
    unansweredReviews,
    unclaimedQuestions,
    estimatedLostCustomers,
    isRealData: false,
  };
}
