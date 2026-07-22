import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic/client";

export interface SupportMessage {
  role: "user" | "assistant";
  content: string;
}

const SUPPORT_SYSTEM_PROMPT = `You are Reputicious's support assistant, answering questions on the public Support Center page.

The only two plans that exist, exactly as follows — do not blur or combine their feature lists:
- Starter ($49/mo): 1 business location, Google + Yelp sync only (no Facebook), AI-drafted responses (100/mo), basic sentiment analytics, email support.
- Pro ($97/mo): up to 5 business locations, Google + Yelp + Facebook sync, unlimited AI-drafted responses, auto-approve rules engine, advanced sentiment analytics, priority support.

Rules:
- Only state plan/feature facts from the list above. If asked about something not covered here (e.g. a feature, policy, or price not listed), say you're not sure and suggest "Talk to a human".
- If the user explicitly asks for a human, say so plainly and mention the "Talk to a human" button below the chat.
- Keep answers concise and friendly, under 120 words.
- Output only the reply text, no preamble.`;

export async function generateSupportReply(history: SupportMessage[]): Promise<string> {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 300,
    system: SUPPORT_SYSTEM_PROMPT,
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
}
