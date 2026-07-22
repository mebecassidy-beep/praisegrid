"use client";

import { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { SubscriptionTier } from "@/types";

const TIER_COPY: Record<SubscriptionTier, { name: string; blurb: string; perks: string[] }> = {
  free: {
    name: "Free",
    blurb: "You're on the free tier — upgrade any time to unlock AI-drafted responses.",
    perks: ["1 business location", "Manual review tracking"],
  },
  starter: {
    name: "Starter",
    blurb: "You're all set on Starter — perfect for getting a single location's reviews under control.",
    perks: ["1 business location", "Google + Yelp sync", "AI-drafted responses (100/mo)"],
  },
  pro: {
    name: "Pro",
    blurb: "You're on Pro — the full toolkit for growing, multi-location brands.",
    perks: [
      "Up to 5 business locations",
      "Google, Yelp + Facebook sync",
      "Unlimited AI-drafted responses",
      "Advanced sentiment analytics",
    ],
  },
  enterprise: {
    name: "Enterprise",
    blurb: "You're on our Enterprise plan with full access across every location.",
    perks: ["Unlimited locations", "Every platform synced", "Unlimited AI-drafted responses"],
  },
};

export function OnboardingModal({ tier }: { tier: SubscriptionTier }) {
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const copy = TIER_COPY[tier];

  async function complete() {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding/complete", { method: "POST" });
    } finally {
      setOpen(false);
    }
  }

  return (
    <Sheet open={open} onClose={complete} className="bg-slate-950 text-white">
      <div className="flex h-full flex-col justify-between p-8">
        <div>
          <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
            <Sparkles className="h-6 w-6 text-white" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Reputicious</h2>
          <p className="mt-2 text-sm text-slate-400">{copy.blurb}</p>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Your plan: {copy.name}
            </p>
            <ul className="mt-3 space-y-2">
              {copy.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-slate-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          onClick={complete}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
        >
          {submitting ? "Taking you in…" : "Get started"}
        </Button>
      </div>
    </Sheet>
  );
}
