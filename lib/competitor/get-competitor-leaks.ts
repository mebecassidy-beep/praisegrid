import { isGooglePlacesConfigured, searchBusinessByName } from "@/lib/google-places/client";
import { generateCompetitorLeaks, type CompetitorLeak } from "@/lib/anthropic/generate-competitor-leaks";

export interface CompetitorLeakResult {
  competitorName: string;
  leaks: CompetitorLeak[];
  isRealData: boolean;
  reviewsAnalyzed: number;
}

const MOCK_LEAKS: CompetitorLeak[] = [
  {
    complaint: "Customers frequently mention long wait times during peak hours.",
    strategy: "Advertise a text-ahead or online booking option so nearby customers see you as the faster choice.",
  },
  {
    complaint: "Several reviewers say staff seemed rushed or inattentive.",
    strategy: "Highlight your team's responsiveness in your own review responses and social posts to contrast directly.",
  },
  {
    complaint: "A few customers describe pricing as unclear until checkout.",
    strategy: "Publish transparent, itemized pricing on your website and Google Business Profile.",
  },
];

/**
 * Real-data path pulls the competitor's own public Google reviews via the
 * official Places API (same ToS-compliant source used everywhere else in
 * lib/competitor — no scraping) and asks Claude to summarize recurring
 * complaint themes into local growth moves. Falls back to a clearly-labeled
 * (isRealData: false) illustrative set when Places isn't configured or no
 * negative reviews are found, matching get-competitor-snapshot.ts's pattern
 * of never presenting invented facts about a real named business.
 */
export async function getCompetitorLeaks(competitorName: string): Promise<CompetitorLeakResult> {
  if (isGooglePlacesConfigured()) {
    try {
      const details = await searchBusinessByName(competitorName);
      const negativeReviews = (details?.reviews ?? []).filter((r) => r.rating > 0 && r.rating <= 3);

      if (negativeReviews.length > 0) {
        const leaks = await generateCompetitorLeaks({
          competitorName: details?.name ?? competitorName,
          negativeReviews,
        });

        if (leaks.length > 0) {
          return {
            competitorName: details?.name ?? competitorName,
            leaks,
            isRealData: true,
            reviewsAnalyzed: negativeReviews.length,
          };
        }
      }
    } catch (error) {
      console.error("Error resolving competitor leaks, falling back to illustrative set:", error);
    }
  }

  return {
    competitorName,
    leaks: MOCK_LEAKS,
    isRealData: false,
    reviewsAnalyzed: 0,
  };
}
