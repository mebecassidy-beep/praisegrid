import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic/client";
import type { PlaceReview } from "@/lib/google-places/client";

export interface CompetitorLeak {
  complaint: string;
  strategy: string;
}

/**
 * Turns a competitor's own real, publicly-visible low-star reviews (pulled
 * via the official Google Places API — see get-competitor-leaks.ts, same
 * ToS-compliant source as the rest of lib/competitor) into a short list of
 * recurring complaint themes, each paired with a concrete local growth move.
 * Every complaint has to trace back to an actual review passed in — the
 * model is instructed not to invent themes beyond what's in the text.
 */
export async function generateCompetitorLeaks(params: {
  competitorName: string;
  negativeReviews: PlaceReview[];
}): Promise<CompetitorLeak[]> {
  const { competitorName, negativeReviews } = params;
  if (negativeReviews.length === 0) return [];

  const reviewsBlock = negativeReviews
    .map((r, i) => `${i + 1}. (${r.rating}★) "${r.text}"`)
    .join("\n");

  const systemPrompt = `You analyze a local competitor's own public negative reviews to help a nearby business
find real, actionable local growth opportunities.
Rules:
- Only surface complaint themes that are actually present in the review text provided — never invent one.
- Merge near-duplicate complaints into a single theme.
- For each theme, write one concrete, specific action the reading business could take to win over customers
  frustrated by that exact gap (e.g. if the theme is slow service, suggest a specific staffing or process fix).
- Return at most 5 themes, ordered by how often they appear.
- Respond with ONLY a JSON array like: [{"complaint": "...", "strategy": "..."}] — no markdown, no preamble.`;

  const userPrompt = `Competitor: ${competitorName}\nTheir recent negative reviews:\n${reviewsBlock}`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 800,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") return [];

  try {
    const parsed = JSON.parse(textBlock.text.trim());
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is CompetitorLeak => typeof item?.complaint === "string" && typeof item?.strategy === "string")
      .slice(0, 5);
  } catch {
    return [];
  }
}
