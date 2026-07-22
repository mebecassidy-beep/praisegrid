"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KineticHeading } from "@/components/motion/kinetic-heading";
import { Parallax } from "@/components/motion/parallax";
import { ScoreRing } from "@/components/landing/score-ring";
import { BlurredPreviewLock } from "@/components/landing/blurred-preview-lock";
import { GoogleBusinessAutocomplete, type PlaceSuggestion } from "@/components/landing/google-business-autocomplete";
import { cn } from "@/lib/utils";

const SCAN_STEPS = [
  "Connecting to your Google Business Profile…",
  "Pulling real rating & review data…",
  "Calculating live visibility score…",
];

type Status = "idle" | "scanning" | "done" | "error";

interface LiveResult {
  name: string;
  rating: number | null;
  userRatingCount: number | null;
  score: number;
  factors: { label: string; value: number }[];
  recentNegativeReviews: { authorName: string; rating: number; text: string }[];
  estimatedLostCustomers: number;
}

export function ScoreScanSection({ googlePlacesEnabled }: { googlePlacesEnabled: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<LiveResult | null>(null);

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
        name: data.details.name,
        rating: data.details.rating,
        userRatingCount: data.details.userRatingCount,
        score: data.live.score,
        factors: data.live.factors,
        recentNegativeReviews: data.live.recentNegativeReviews,
        estimatedLostCustomers: data.live.estimatedLostCustomers,
      });
      setStatus("done");
    } catch {
      clearInterval(stepInterval);
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <Parallax className="absolute inset-0" speed={60}>
        <div
          className="h-[130%] w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 15%, rgba(59,130,246,0.18), transparent 40%), radial-gradient(circle at 75% 70%, rgba(139,92,246,0.16), transparent 42%)",
          }}
        />
      </Parallax>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Live Google data — free preview
            </div>

            <KineticHeading
              text="Claim your business and see what's costing you customers"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            />

            <p className="mt-5 max-w-md text-lg text-slate-400">
              Find your business on Google below for a live AI Visibility Score pulled from your real
              rating and reviews — no account required.
            </p>

            {googlePlacesEnabled ? (
              <div className="mt-8 max-w-md">
                <GoogleBusinessAutocomplete onSelect={handleSelect} disabled={status === "scanning"} />
              </div>
            ) : (
              <div className="mt-8 max-w-md">
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

            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Google Business Profile data only — Yelp &amp; Facebook connect securely after you start your
              free trial and log in.
            </p>

            <p className="mt-2 text-xs font-semibold text-slate-400">
              No credit card required • Cancel anytime with 1-click
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-violet-500/10 to-transparent blur-2xl" />
            <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <AnimatePresence mode="wait">
                {status === "idle" && <BlurredPreviewLock key="idle" />}

                {status === "scanning" && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[330px] flex-col items-center justify-center gap-6"
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
                            i === Math.min(step, SCAN_STEPS.length - 1)
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
                    className="flex min-h-[330px] flex-col items-center justify-center gap-4 text-center"
                  >
                    <AlertTriangle className="h-8 w-8 text-amber-400" />
                    <p className="text-sm text-slate-400">
                      We couldn&apos;t pull live data for that listing just now.
                    </p>
                    <Button asChild className="gap-2 bg-white text-slate-900 hover:bg-slate-200">
                      <Link href="/signup">
                        Start Free Trial instead
                        <ArrowRight className="h-4 w-4" />
                      </Link>
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
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Live AI Visibility Score
                          {result.rating != null && result.userRatingCount != null && (
                            <>
                              {" "}
                              · {result.rating.toFixed(1)}★ ({result.userRatingCount.toLocaleString()} reviews)
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {result.factors.map((factor) => (
                        <div key={factor.label}>
                          <div className="mb-1 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{factor.label}</span>
                            <span className="font-medium text-slate-300">{factor.value}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${factor.value}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
                      <div className="mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs font-semibold text-red-400">
                          Live vulnerabilities for {result.name}
                        </span>
                      </div>
                      {result.recentNegativeReviews.length > 0 ? (
                        <div className="mb-2 rounded-lg bg-white/5 p-2.5">
                          <p className="text-[11px] font-medium text-slate-300">
                            Recent complaint visible to customers — {result.recentNegativeReviews[0].authorName}
                          </p>
                          <p className="mt-1 text-xs italic text-slate-400">
                            &ldquo;{result.recentNegativeReviews[0].text.slice(0, 140)}
                            {result.recentNegativeReviews[0].text.length > 140 ? "…" : ""}&rdquo;
                          </p>
                        </div>
                      ) : (
                        <p className="mb-2 text-xs text-slate-300">
                          No low-rated recent reviews found — nice work. Reputicious keeps it that way.
                        </p>
                      )}
                      <p className="text-xs text-slate-300">
                        Est. <span className="font-semibold text-white">{result.estimatedLostCustomers}</span>{" "}
                        customers/mo lost to unresolved negative reviews
                        <span className="text-slate-500"> — estimate, based on industry response-rate studies</span>
                      </p>
                    </div>

                    <Button
                      asChild
                      className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-200"
                    >
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
      </div>
    </section>
  );
}
