import type { TonePreset } from "@/types";

export const TONE_PRESETS: Record<Exclude<TonePreset, "custom">, { label: string; description: string; instructions: string }> = {
  friendly_neighborhood: {
    label: "Friendly Neighborhood Spot",
    description: "Warm and casual, like a regular customer got a reply from someone they know.",
    instructions:
      "Warm, casual, and personal — like a neighbor, not a corporation. Use the reviewer's first name, contractions, and the occasional exclamation point. Mention local touches (the block, the team by first name) when it fits naturally. Never sound scripted or corporate.",
  },
  professional_corporate: {
    label: "Professional Corporate",
    description: "Polished and formal, consistent with a larger brand's voice.",
    instructions:
      "Polished, formal, and consistent with a professional brand voice. Avoid slang, contractions, and exclamation points. Speak on behalf of the business in third person where natural (e.g. \"our team\"). Keep language precise and businesslike while still warm.",
  },
};
