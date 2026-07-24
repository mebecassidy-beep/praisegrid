"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, Radar, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/landing/score-ring";
import { BlurredPreviewLock } from "@/components/landing/blurred-preview-lock";
import { GoogleBusinessAutocomplete, type PlaceSuggestion } from "@/components/landing/google-business-autocomplete";
import { cn } from "@/lib/utils";

const SCAN_STEPS = [
  "Connecting to your Google Business Profile…",
  "Pulling real rating & review data…",
  "Calculating live Reputation Score…",
];

const DEFAULT_VALUE_PER_CUSTOMER = 275;
const MIN_VALUE = 0;
const MAX_VALUE = 2000;

type Status = "idle" | "scanning" | "done" | "error";

interface LiveResult {
  placeId: string;
  name: string;
  rating: number | null;
  userRatingCount: number | null;
  score: number;
  recentNegativeReviews: { authorName: string; rating: number; text: string }[];
  estimatedLostCustomers: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    amount
  );
}

/**
 * Uses the same Google Places autocomplete -> /api/places/details pipeline
 * as the homepage's ScoreScanSection, not the freeform-text /api/public/
 * business-scan lookup this previously used. That endpoint fuzzy-matches by
 * name and silently falls back to an illustrative estimate whenever it
 * can't confidently resolve a listing, autocomplete selection is always a
 * specific real placeId, so there's no fallback branch and no "why didn't
 * this show my real numbers" gap between this page and the homepage.
 */
export function ReputationSimulator({ googlePlacesEnabled }: { googlePlacesEnabled: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<LiveResult | null>(null);
  const [valuePerCustomer, setValuePerCustomer] = useState(DEFAULT_VALUE_PER_CUSTOMER);

  async function handleSelect(suggestion: PlaceSuggestion) {
    if (status === "scanning") return;
    setStatus("scanning");
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1));
    }, 550);

    try {
      const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(suggestion.placeId)}`);
      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok || !data.details) {
        setStatus("error");
        return;
      }

      setResult({
        placeId: suggestion.placeId,
        name: data.details.name,
        rating: data.details.rating,
        userRatingCount: data.details.userRatingCount,
        score: data.live.score,
        recentNegativeReviews: data.live.recentNegativeReviews,
        estimatedLostCustomers: data.live.estimatedLostCustomers,
      });
      setStatus("done");
    } catch {
      clearInterval(stepInterval);
      setStatus("error");
    }
  }

  const monthlyRevenueAtRisk = useMemo(
    () => (result ? result.estimatedLostCustomers * valuePerCustomer : 0),
    [result, valuePerCustomer]
  );

  return (
    <section id="simulator" className="scroll-mt-20 bg-surface-dark py-20 text-surface-dark-foreground">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <Radar className="h-3.5 w-3.5 text-blue-400" />
            Live reputation scan
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Run your own numbers</h2>
          <p className="mt-4 text-lg text-slate-400">
            Find your business on Google to get a real Reputation Score, then drag the slider to see what
            unresolved reviews could be costing you, using your own estimate of what a customer is worth.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          {googlePlacesEnabled ? (
            <GoogleBusinessAutocomplete onSelect={handleSelect} disabled={status === "scanning"} />
          ) : (
            <div className="flex justify-center">
              <Button
                asChild
                className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
              >
                <Link href="/signup">
                  <Search className="h-4 w-4" />
                  Start Free Trial to Run Your Audit
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
            <AnimatePresence mode="wait">
              {status === "idle" && <BlurredPreviewLock key="idle" />}

              {status === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[280px] flex-col items-center justify-center gap-6"
                >
                  <div className="relative flex h-24 w-24 items-center justify-center">
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                      animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-violet-500/30"
                      animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />
                    <Search className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="space-y-1.5 text-center">
                    {SCAN_STEPS.map((label, i) => (
                      <p
                        key={label}
                        className={cn(
                          "text-sm transition-colors",
                          i === step
                            ? "font-medium text-white"
                            : i < step
                              ? "text-slate-600 line-through"
                              : "text-slate-600"
                        )}
                      >
                        {label}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center"
                >
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                  <p className="max-w-[260px] text-sm text-slate-400">
                    We couldn&apos;t pull live data for that listing just now.
                  </p>
                  <Button variant="outline" onClick={() => setStatus("idle")}>
                    Try again
                  </Button>
                </motion.div>
              )}

              {status === "done" && result && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <ScoreRing score={result.score} size={88} />
                    <div>
                      <p className="text-sm font-medium text-white">{result.name}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <p className="text-xs text-slate-400">Reputation Score</p>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Live Google data
                        </span>
                      </div>
                      {result.rating != null && result.userRatingCount != null && (
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-300">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-white">{result.rating.toFixed(1)}</span>
                          <span className="text-slate-500">({result.userRatingCount.toLocaleString()} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {result.recentNegativeReviews.length > 0 && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                      <div className="mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs font-semibold text-red-400">Recent complaint visible to customers</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        &ldquo;{result.recentNegativeReviews[0].text.slice(0, 140)}
                        {result.recentNegativeReviews[0].text.length > 140 ? "…" : ""}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <label htmlFor="value-slider" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                        Value per customer
                      </label>
                      <span className="text-sm font-semibold text-white">{formatCurrency(valuePerCustomer)}</span>
                    </div>
                    <input
                      id="value-slider"
                      type="range"
                      min={MIN_VALUE}
                      max={MAX_VALUE}
                      step={5}
                      value={valuePerCustomer}
                      onChange={(e) => setValuePerCustomer(Number(e.target.value))}
                      className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-emerald-500/20 accent-emerald-500"
                    />
                    <p className="mt-3 text-sm text-slate-300">
                      Est.{" "}
                      <span className="font-semibold text-white">{result.estimatedLostCustomers}</span> customers/mo
                      lost to unresolved reviews ×{" "}
                      <span className="font-semibold text-white">{formatCurrency(valuePerCustomer)}</span> ={" "}
                      <span className="font-semibold text-emerald-400">{formatCurrency(monthlyRevenueAtRisk)}</span>{" "}
                      /mo at risk
                    </p>
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      Only &ldquo;value per customer&rdquo; is yours to set, everything else here comes from your
                      real Google Business Profile.
                    </p>
                  </div>

                  <Button asChild className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-200">
                    <Link href="/signup">
                      Claim Your Free Trial to Unlock Full Dashboard & AI Replies
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-center text-xs text-slate-500">
                    No credit card required • Cancel anytime with 1-click
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
