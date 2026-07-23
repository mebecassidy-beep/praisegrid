import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic/client";
import type { AiSettings, Review } from "@/types";

export type ToneOverride = "empathetic" | "professional" | "brand-hero";

const TONE_OVERRIDES: Record<ToneOverride, string> = {
  empathetic: "For this response specifically, lean especially warm, empathetic, and personal.",
  professional: "For this response specifically, lean polished, formal, and professional.",
  "brand-hero": "For this response specifically, let the brand's personality and enthusiasm shine through.",
};

interface GenerateReviewResponseInput {
  review: Pick<Review, "reviewer_name" | "rating" | "review_text" | "platform" | "risk_level">;
  aiSettings?: Pick<AiSettings, "tone_instructions" | "sign_off_name"> | null;
  businessName: string;
  toneOverride?: ToneOverride;
  /**
   * A specific courtesy perk to weave into the response (e.g. "a
   * complimentary appetizer on their next visit"). Deliberately ignored
   * whenever the review is crisis-flagged (see isCrisis below) - CRISIS_RULES
   * bans promising compensation/discounts on 1-2 star reviews, and that
   * safety rule is enforced here server-side, not just by hiding the control
   * in the UI, so it can't be bypassed by a crafted request.
   */
  perkOffer?: string;
}

// "Crisis Mode" reviews (risk_level medium/high — 1-2 stars, "high" also
// hits a lawsuit/injury/health-inspector keyword, see classify-risk.ts) get
// stricter drafting rules layered on top of the normal tone guidance: the
// goal is a reply the owner can approve in one click without a lawyer
// reviewing it first, so it must never look like an admission of fault.
const CRISIS_RULES = `
This review is flagged as high-risk. Layer these rules on top of the ones above:
- Do not admit fault, liability, or wrongdoing, and do not concede that the reviewer's account of events is accurate.
- Do not promise refunds, compensation, discounts, or any specific remedy.
- Do not reference lawsuits, injuries, health/safety incidents, or any legal or regulatory matter, even to deny them.
- Stay calm and empathetic about their experience without validating specific claims.
- Move the conversation offline: ask them to contact the business directly (phone/email) to discuss further.
- Keep it brief and even more measured in tone than usual.`;

export async function generateReviewResponse({
  review,
  aiSettings,
  businessName,
  toneOverride,
  perkOffer,
}: GenerateReviewResponseInput): Promise<string> {
  const toneInstructions =
    aiSettings?.tone_instructions?.trim() ||
    "Warm, professional, and appreciative in tone.";
  const signOff = aiSettings?.sign_off_name?.trim() || "The Team";
  const isCrisis = review.risk_level === "high" || review.risk_level === "medium";

  // perkOffer is only ever honored on non-crisis reviews - enforced here,
  // not just left to the caller, since this is the actual safety boundary.
  const safePerkOffer = !isCrisis ? perkOffer?.trim() : undefined;

  const systemPrompt = `You write public-facing owner responses to customer reviews for the local business "${businessName}".
Tone guidance: ${toneInstructions}
Rules:
- Keep the response under 120 words.
- Address the reviewer by name if provided.
- Never invent facts, discounts, or promises not present in the review.
- For ratings of 3 or below, acknowledge the issue and invite the reviewer to follow up privately.
- Sign off as "${signOff}".
- Output only the response text, no preamble.
${toneOverride ? TONE_OVERRIDES[toneOverride] : ""}
${safePerkOffer ? `Naturally offer this as a gesture of goodwill: ${safePerkOffer}.` : ""}
${isCrisis ? CRISIS_RULES : ""}`;

  const userPrompt = `Platform: ${review.platform}
Reviewer: ${review.reviewer_name ?? "Anonymous"}
Rating: ${review.rating}/5
Review: "${review.review_text ?? ""}"`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 400,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
}
