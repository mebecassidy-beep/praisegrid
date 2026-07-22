"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRO_PERKS = [
  "Up to 5 business locations",
  "Google, Yelp + Facebook sync",
  "Unlimited AI-drafted responses",
  "Auto-approve rules engine",
];

/**
 * Server-enforced paywall content for Franchise View. Previously the tier
 * gate only existed in the sidebar (a lock icon that opened an upsell
 * modal on click) — the route itself had no check, so a Free-tier account
 * could see the real feature just by visiting /franchise directly. This
 * renders instead of the real page content for free-tier users, regardless
 * of how they got here.
 */
export function FranchiseLockedState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "pro", trial: true }),
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
    <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center">
      <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
        <Lock className="h-6 w-6 text-white" />
      </span>
      <h2 className="text-xl font-bold tracking-tight">Franchise View is a Pro feature</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Upgrade to compare every location side by side — start with a 7-day free trial, no commitment.
      </p>

      <ul className="mt-6 space-y-2 text-left">
        {PRO_PERKS.map((perk) => (
          <li key={perk} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {perk}
          </li>
        ))}
      </ul>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Button
        onClick={startTrial}
        disabled={loading}
        className="mt-6 w-full gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Start Free Trial — No Credit Card Required
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
