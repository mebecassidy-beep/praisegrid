import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic/client";
import type { AiSettings, Review } from "@/types";

interface GenerateReviewResponseInput {
  review: Pick<Review, "reviewer_name" | "rating" | "review_text" | "platform">;
  aiSettings?: Pick<AiSettings, "tone_instructions" | "sign_off_name"> | null;
  businessName: string;
}

export async function generateReviewResponse({
  review,
  aiSettings,
  businessName,
}: GenerateReviewResponseInput): Promise<string> {
  const toneInstructions =
    aiSettings?.tone_instructions?.trim() ||
    "Warm, professional, and appreciative in tone.";
  const signOff = aiSettings?.sign_off_name?.trim() || "The Team";

  const systemPrompt = `You write public-facing owner responses to customer reviews for the local business "${businessName}".
Tone guidance: ${toneInstructions}
Rules:
- Keep the response under 120 words.
- Address the reviewer by name if provided.
- Never invent facts, discounts, or promises not present in the review.
- For ratings of 3 or below, acknowledge the issue and invite the reviewer to follow up privately.
- Sign off as "${signOff}".
- Output only the response text, no preamble.`;

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
