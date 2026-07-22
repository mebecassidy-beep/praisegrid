"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const OFFER_COPY: Record<string, string> = {
  scan50: "50% off your first month",
};

export function OfferBanner() {
  const searchParams = useSearchParams();
  const offer = searchParams.get("offer");
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!offer || !OFFER_COPY[offer] || dismissed) return null;

  async function claimOffer() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer }),
      });
      const data = await response.json();
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Couldn't start checkout.");
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Couldn't start checkout.");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
      <div className="flex items-center gap-2 text-sm">
        <Tag className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          Launch offer available: <span className="font-semibold">{OFFER_COPY[offer]}</span>
          {error && <span className="ml-2 text-red-500">{error}</span>}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={claimOffer} disabled={loading}>
          {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          Claim Offer
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Dismiss offer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
