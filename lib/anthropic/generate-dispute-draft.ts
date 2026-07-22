import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic/client";
import type { Platform, Review } from "@/types";

interface GenerateDisputeDraftInput {
  review: Pick<Review, "reviewer_name" | "rating" | "review_text" | "platform">;
  businessName: string;
  ownerNotes: string;
}

// Real, current grounds each platform accepts for a content-policy removal
// request — the draft has to name one of these or the report gets rejected.
// Neither platform exposes a public API for filing these, so this only ever
// produces a draft for the owner to paste into the platform's own report
// flow; nothing here submits anything automatically.
const PLATFORM_POLICY: Record<Platform, string> = {
  google: `Google's review policies (support.google.com/business/answer/2622994) prohibit: content unrelated to
a genuine customer experience at this business, conflict of interest (e.g. a competitor or ex-employee posting),
spam/fake engagement, and off-topic or restricted content. A removal request must cite one of these categories
with specific, factual reasons — not just disagreement with the rating.`,
  yelp: `Yelp's Content Guidelines (yelp.com/guidelines) prohibit reviews that aren't based on a firsthand
customer experience, conflict-of-interest posts, and content that violates their Terms of Service. Yelp asks
for specific, factual reasons a review violates these guidelines when you flag it.`,
  facebook: `Meta's Community Standards prohibit fake engagement and reviews not based on a genuine experience
with the business. A report should cite specific, factual reasons the review doesn't reflect a real interaction.`,
};

export async function generateDisputeDraft({
  review,
  businessName,
  ownerNotes,
}: GenerateDisputeDraftInput): Promise<string> {
  const systemPrompt = `You draft formal content-policy dispute letters for local business owners to submit
through a review platform's own "report this review" flow. You write for the business owner, addressed to the
platform's content policy / trust & safety team.

${PLATFORM_POLICY[review.platform]}

Rules:
- Only draft a dispute grounded in the specific policy violation categories above — never argue that a review
  should be removed merely because it's negative.
- Base every factual claim strictly on the owner's notes below. Never invent transaction records, dates, or
  evidence the owner didn't provide.
- If the owner's notes don't clearly support one of the policy categories, say so plainly instead of drafting
  a weak or misleading dispute.
- Keep a formal, factual, non-emotional tone. No threats, no legal language.
- End with a request for the review's removal per the cited policy.
- Output only the letter text, no preamble or explanation.`;

  const userPrompt = `Business: ${businessName}
Platform: ${review.platform}
Reviewer name shown on the review: ${review.reviewer_name ?? "Anonymous"}
Rating: ${review.rating}/5
Review text: "${review.review_text ?? ""}"

Owner's notes on why this review is believed to violate policy (e.g. no record of this customer, mentions a
different business, posted by a competitor, etc.):
"${ownerNotes}"`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
}
