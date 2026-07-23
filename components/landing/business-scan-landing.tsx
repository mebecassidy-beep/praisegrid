"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Loader2, Search, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreRing } from "@/components/landing/score-ring";
import { BlurredPreviewLock } from "@/components/landing/blurred-preview-lock";
import { parseBusinessInput } from "@/lib/business-scan/parse-business-input";
import { cn } from "@/lib/utils";
import type { BusinessScanResult } from "@/lib/business-scan/get-business-scan";

const SCAN_STEPS = [
  "Pulling your Google Business Profile…",
  "Cross-referencing Yelp & Facebook…",
  "Calculating your Reputation Score…",
];

type Status = "idle" | "scanning" | "done" | "error";

export function BusinessScanLanding() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<BusinessScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const displayName = parseBusinessInput(businessName).label || "Your Business";
  const signupHref = `/signup?offer=scan50${
    businessName.trim() ? `&business=${encodeURIComponent(businessName.trim())}` : ""
  }`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(59,130,246,0.18), transparent 40%), radial-gradient(circle at 80% 60%, rgba(139,92,246,0.16), transparent 42%)",
        }}
      />

      <header className="relative border-b border-white/5">
        <div className="container flex items-center gap-2 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
            <Star className="h-4 w-4 fill-white text-white" />
          </div>
          <span className="text-lg font-bold text-white">Reputicious</span>
        </div>
      </header>

      <div className="container relative py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <Search className="h-3.5 w-3.5 text-blue-400" />
            Free reputation scan
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            See what your reviews are really costing you
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg text-slate-400">
            Enter your business to get an instant Reputation Score, see how many customers you&apos;re
            likely losing to unanswered reviews, and unlock a launch discount to fix it.
          </p>

          <form
            onSubmit={runScan}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
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
              {status === "scanning" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Scan My Business
            </Button>
          </form>

          <p className="mt-3 text-xs text-slate-500">
            Pulls live Google Business Profile data when we can find your listing, otherwise shows a
            benchmark estimate for businesses your size.
          </p>
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
                      <p className="text-xs text-slate-400">Reputation Score</p>
                      {result.currentRating != null && result.reviewCount != null && (
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-300">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-white">{result.currentRating}</span>
                          <span className="text-slate-500">
                            ({result.reviewCount} reviews), current
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                      <span className="text-xs font-semibold text-red-400">
                        What&apos;s costing {displayName} customers
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.recentComplaintSnippet && (
                        <li>
                          Recent complaint visible to customers: &ldquo;
                          {result.recentComplaintSnippet.slice(0, 120)}
                          {result.recentComplaintSnippet.length > 120 ? "…" : ""}&rdquo;
                        </li>
                      )}
                      <li>
                        Est.{" "}
                        <span className="font-semibold text-white">
                          {result.estimatedLostCustomers}
                        </span>{" "}
                        customers/mo lost to unresolved negative reviews
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">
                        Launch offer
                      </span>
                    </div>
                    <p className="text-sm text-white">
                      Fix this now and get <span className="font-bold">50% off your first month</span>.
                    </p>
                  </div>

                  <Button
                    asChild
                    className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-200"
                  >
                    <Link href={signupHref}>
                      Claim 50% Off & Fix My Reputation
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
