import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic/client";
import type { AiSettings, Review } from "@/types";

interface GenerateSocialCaptionInput {
  review: Pick<Review, "reviewer_name" | "rating" | "review_text" | "platform">;
  aiSettings?: Pick<AiSettings, "tone_instructions"> | null;
  businessName: string;
}

/**
 * Turns a verified 5-star review into an Instagram/Facebook-ready caption.
 * "Verified" here means the review is real customer content already synced
 * from the platform (see reviews table) and the owner has approved a
 * response to it — this only ever quotes what the reviewer actually wrote,
 * it never fabricates a testimonial.
 */
export async function generateSocialCaption({
  review,
  aiSettings,
  businessName,
}: GenerateSocialCaptionInput): Promise<string> {
  const toneInstructions = aiSettings?.tone_instructions?.trim() || "Warm and genuine, not overly salesy.";

  const systemPrompt = `You write Instagram/Facebook captions for a local business to post their own 5-star
customer review as a social proof graphic.
Tone guidance: ${toneInstructions}
Rules:
- Quote or closely paraphrase the review itself — never invent details the reviewer didn't mention.
- Thank the reviewer by first name only if a name was given.
- Credit the platform naturally (e.g. "via Google").
- Include 3-5 relevant, non-spammy hashtags (mix of local + industry, no more than one branded hashtag).
- Keep it under 60 words plus hashtags.
- Output only the caption text, no preamble.`;

  const userPrompt = `Business: ${businessName}
Platform: ${review.platform}
Reviewer: ${review.reviewer_name ?? "a customer"}
Review: "${review.review_text ?? ""}"`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 300,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
}
