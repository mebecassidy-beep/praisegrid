import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic/client";

interface GenerateInstantFixInput {
  businessName: string;
  complaint: string;
}

export async function generateInstantFixResponse({
  businessName,
  complaint,
}: GenerateInstantFixInput): Promise<string> {
  const systemPrompt = `You write public-facing owner responses to an angry customer review for the local business "${businessName}".
Rules:
- Keep the response under 110 words.
- Fully defuse the anger: acknowledge the specific complaint, apologize sincerely, and invite the reviewer to follow up privately to make it right.
- Naturally weave in the business name once, as a local owner would when signing a public reply.
- Never invent facts, discounts, or promises not present in the complaint.
- Sound warm, professional, and genuinely accountable — never defensive or scripted.
- Output only the response text, no preamble, no quotation marks.`;

  const userPrompt = `Angry 1-star review: "${complaint}"`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 300,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
}
