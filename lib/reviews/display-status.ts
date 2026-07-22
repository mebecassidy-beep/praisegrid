import type { Review } from "@/types";

export type DisplayStatus = "flagged" | "pending" | "approved" | "posted";

/**
 * Derives the UI-facing status for a review. "flagged" isn't a stored status
 * value (see types/database.ts ReviewStatus) — it's computed from risk_level
 * so a risky review still reads as urgent even while status stays "pending".
 *
 * Only "medium"/"high" count as flagged. The live risk_level column defaults
 * to "low" at the database level (schema drift from schema.sql, which has no
 * default) — treating "low" as flagged would mark nearly every pending
 * review urgent, which defeats the point.
 */
export function getDisplayStatus(review: Pick<Review, "status" | "risk_level">): DisplayStatus {
  if (review.status === "pending" && (review.risk_level === "medium" || review.risk_level === "high")) {
    return "flagged";
  }
  return review.status;
}

/**
 * Sort key for "Crisis Mode" triage: high-risk reviews pin to the very top of
 * the feed, medium-risk (flagged) next, everything else keeps its existing
 * order. Use with Array.prototype.sort, which is stable in all supported
 * runtimes — so within a rank, original (most-recent-first) order is kept.
 */
export function crisisRank(review: Pick<Review, "status" | "risk_level">): number {
  if (review.risk_level === "high") return 0;
  if (getDisplayStatus(review) === "flagged") return 1;
  return 2;
}
