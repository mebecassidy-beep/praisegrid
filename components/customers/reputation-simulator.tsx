"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Loader2, Radar, Search, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreRing } from "@/components/landing/score-ring";
import { BlurredPreviewLock } from "@/components/landing/blurred-preview-lock";
import { parseBusinessInput } from "@/lib/business-scan/parse-business-input";
import { cn } from "@/lib/utils";
import type { BusinessScanResult } from "@/lib/business-scan/get-business-scan";

const SCAN_STEPS = [
  "Pulling your Google Business Profile…",
  "Cross-referencing recent reviews…",
  "Calculating your Reputation Score…",
];

const DEFAULT_VALUE_PER_CUSTOMER = 275;
const MIN_VALUE = 0;
const MAX_VALUE = 2000;

type Status = "idle" | "scanning" | "done" | "error";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    amount
  );
}

/**
 * Replaces the old grid of fabricated case studies (fictional business
 * names with pre-written before/after numbers) with a live tool: it calls
 * the same /api/public/business-scan endpoint the /scan landing page uses,
 * which returns real Google Business Profile data when it can find the
 * listing (isRealData: true) and a clearly-labeled benchmark estimate
 * otherwise - never a number presented as real when it isn't. The revenue
 * calculator below the score is entirely user-driven: only the "value per
 * customer" input is adjustable, everything downstream is plain
 * multiplication shown in the open.
 */
export function ReputationSimulator() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<BusinessScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [valuePerCustomer, setValuePerCustomer] = useState(DEFAULT_VALUE_PER_CUSTOMER);

  async function runScan(e: React.FormEvent) {
    e.preventDefault();
    if (status === "scanning" || !businessName.trim()) return;

    setStatus("scanning");
    setStep(0);
    setError(null);

    const stepInterval = setInterval(() => {
      setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1));
    }, 550);

    try {
      const { label } = parseBusinessInput(businessName);
      const [response] = await Promise.all([
        fetch("/api/public/business-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessName: label, city: city.trim() || undefined }),
        }),
        new Promise((resolve) => setTimeout(resolve, SCAN_STEPS.length * 550)),
      ]);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setResult(data.result);
      setStatus("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      clearInterval(stepInterval);
    }
  }

  const displayName = parseBusinessInput(businessName).label || "Your business";
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
            Enter your business to get a real Reputation Score, then drag the slider to see what
            unresolved reviews could be costing you, using your own estimate of what a customer is worth.
          </p>
        </div>

        <form onSubmit={runScan} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Business name or Google Business Profile URL"
            className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
          />
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (optional)"
            className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 sm:max-w-[180px]"
          />
          <Button
            type="submit"
            disabled={status === "scanning" || !businessName.trim()}
            className="shrink-0 gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
          >
            {status === "scanning" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Scan My Business
          </Button>
        </form>

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
                  <p className="max-w-[260px] text-sm text-slate-400">{error}</p>
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
                    <ScoreRing score={result.reputationScore} size={88} />
                    <div>
                      <p className="text-sm font-medium text-white">{displayName}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <p className="text-xs text-slate-400">Reputation Score</p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
                            result.isRealData
                              ? "border-emerald-500/30 text-emerald-400"
                              : "border-amber-500/30 text-amber-400"
                          )}
                        >
                          {result.isRealData ? (
                            <>
                              <ShieldCheck className="h-2.5 w-2.5" />
                              Live Google data
                            </>
                          ) : (
                            "Illustrative benchmark"
                          )}
                        </span>
                      </div>
                      {result.currentRating != null && result.reviewCount != null && (
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-300">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-white">{result.currentRating}</span>
                          <span className="text-slate-500">({result.reviewCount} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {result.recentComplaintSnippet && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                      <div className="mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs font-semibold text-red-400">Recent complaint visible to customers</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        &ldquo;{result.recentComplaintSnippet.slice(0, 140)}
                        {result.recentComplaintSnippet.length > 140 ? "…" : ""}&rdquo;
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
                      Only &ldquo;value per customer&rdquo; is yours to set, everything else here comes from the scan
                      above.
                    </p>
                  </div>

                  <Button asChild className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-200">
                    <Link href="/signup">
                      Start Free Trial
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
