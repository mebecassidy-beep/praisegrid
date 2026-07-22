import type { RiskLevel } from "@/types";

// Deliberately simple v1 heuristic — fast, free, synchronous, no added
// latency/cost on every ingested review. A Claude-based classifier is a
// natural future upgrade; out of scope for this phase.
const HIGH_RISK_KEYWORDS = [
  "lawsuit", "lawyer", "attorney", "sue", "sued", "suing",
  "health inspector", "food poisoning", "unsafe", "injury", "injured",
  "police", "discrimination", "harassment", "assault", "fraud", "scam",
  "hospital", "ambulance",
];

export function classifyReviewRisk(rating: number, reviewText: string | null): RiskLevel | null {
  if (rating > 2) return null;

  const text = (reviewText || "").toLowerCase();
  if (rating === 1 && HIGH_RISK_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return "high";
  }

  return "medium";
}
