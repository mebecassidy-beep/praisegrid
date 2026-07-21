"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Loader2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KineticHeading } from "@/components/motion/kinetic-heading";
import { Parallax } from "@/components/motion/parallax";
import { ScoreRing } from "@/components/landing/score-ring";
import { DrawTrendChart } from "@/components/landing/draw-trend-chart";
import { cn } from "@/lib/utils";

const SCAN_STEPS = [
  "Checking Google Business Profile…",
  "Analyzing review sentiment…",
  "Calculating AI visibility score…",
];

const FACTOR_LABELS = [
  "Google Business Profile completeness",
  "Review response rate",
  "AI crawler accessibility",
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

type Status = "idle" | "scanning" | "done";

export function ScoreScanSection() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{
    score: number;
    factors: number[];
    unansweredReviews: number;
    unclaimedQuestions: number;
    estimatedLostCustomers: number;
  } | null>(null);

  function runScan(e: React.FormEvent) {
    e.preventDefault();
    if (status === "scanning") return;

    setStatus("scanning");
    setStep(0);

    const seed = hashString(name.trim() || "your business");
    const score = 68 + (seed % 24);
    const factors = FACTOR_LABELS.map((_, i) => 60 + ((seed >> (i * 3)) % 38));
    const unansweredReviews = 4 + (seed % 19);
    const unclaimedQuestions = 1 + ((seed >> 4) % 7);
    const estimatedLostCustomers = 8 + ((seed >> 7) % 42);

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= SCAN_STEPS.length) {
        clearInterval(interval);
        setResult({ score, factors, unansweredReviews, unclaimedQuestions, estimatedLostCustomers });
        setStatus("done");
      }
    }, 550);
  }

  const displayName = name.trim() || "Your Business";

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
              Free instant preview
            </div>

            <KineticHeading
              text="Claim your business and see what's costing you customers"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            />

            <p className="mt-5 max-w-md text-lg text-slate-400">
              Enter your business name for a live preview of the AI Visibility Score and
              hidden vulnerabilities Reputicious finds in your Google, Yelp, and Facebook presence.
            </p>

            <form onSubmit={runScan} className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Brightleaf Cafe"
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
              <Button
                type="submit"
                disabled={status === "scanning"}
                className="shrink-0 gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
              >
                {status === "scanning" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Claim My Business
              </Button>
            </form>

            <p className="mt-3 text-xs text-slate-500">
              Illustrative preview using sample data — no account or real business data required.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-violet-500/10 to-transparent blur-2xl" />
            <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[330px] flex-col items-center justify-center gap-3 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                      <Search className="h-6 w-6 text-slate-500" />
                    </div>
                    <p className="max-w-[220px] text-sm text-slate-500">
                      Run a scan to see a live preview of your score
                    </p>
                  </motion.div>
                )}

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
                        <p className="text-sm font-medium text-white">{displayName}</p>
                        <p className="text-xs text-slate-400">AI Visibility Score preview</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {FACTOR_LABELS.map((label, i) => (
                        <div key={label}>
                          <div className="mb-1 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{label}</span>
                            <span className="font-medium text-slate-300">{result.factors[i]}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${result.factors[i]}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="mb-2 text-xs font-medium text-slate-400">
                        Typical rating growth on Reputicious
                      </p>
                      <DrawTrendChart />
                    </div>

                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
                      <div className="mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs font-semibold text-red-400">
                          Vulnerabilities found for {displayName}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        <li>
                          <span className="font-semibold text-white">{result.unansweredReviews}</span>{" "}
                          unanswered reviews visible to potential customers
                        </li>
                        <li>
                          <span className="font-semibold text-white">{result.unclaimedQuestions}</span>{" "}
                          unanswered Google Q&amp;A questions
                        </li>
                        <li>
                          Est. <span className="font-semibold text-white">{result.estimatedLostCustomers}</span>{" "}
                          customers/mo lost to unresolved negative reviews
                        </li>
                      </ul>
                    </div>

                    <Button
                      asChild
                      className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-200"
                    >
                      <Link href="/signup">
                        Fix these issues — Start Free Trial
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
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
