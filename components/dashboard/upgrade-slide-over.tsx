"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, Lock, Sparkles } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const TIER_PERKS: Record<"starter" | "pro", string[]> = {
  starter: ["1 business location", "Google + Yelp sync", "AI-drafted responses (100/mo)"],
  pro: [
    "Up to 5 business locations",
    "Google, Yelp + Facebook sync",
    "Unlimited AI-drafted responses",
    "Auto-approve rules engine",
  ],
};

export function UpgradeSlideOver({
  open,
  onClose,
  featureName,
  tier = "pro",
}: {
  open: boolean;
  onClose: () => void;
  featureName: string;
  tier?: "starter" | "pro";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, trial: true }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Couldn't start checkout.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Couldn't start checkout.");
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} className="bg-slate-950 text-white">
      <div className="flex h-full flex-col justify-between p-8">
        <div>
          <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
            <Lock className="h-6 w-6 text-white" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight">{featureName} is a {tier === "pro" ? "Pro" : "Starter"} feature</h2>
          <p className="mt-2 text-sm text-slate-400">
            Upgrade to unlock it instantly — start with a 7-day free trial, no commitment.
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              What you unlock
            </p>
            <ul className="mt-3 space-y-2">
              {TIER_PERKS[tier].map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-slate-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>

        <div className="space-y-2">
          <Button
            onClick={startTrial}
            disabled={loading}
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Start Free Trial — No Credit Card Required
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-center text-xs text-slate-500">Cancel anytime with 1-click</p>
        </div>
      </div>
    </Sheet>
  );
}
