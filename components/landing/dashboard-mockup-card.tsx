"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REVIEW = {
  reviewerName: "Jordan T.",
  rating: 1,
  text: "Waited 40 minutes past my reservation and no one seemed to care. Won't be returning.",
};

const AI_RESPONSE =
  "Jordan, I'm sorry, that wait is completely unacceptable and not the experience we want for anyone. " +
  "I'd like to make this right personally, please reach out directly so we can. From the owner, The Copper Fork";

type DemoPhase = "idle" | "generating" | "generated" | "posted";

export function DashboardMockupCard() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [autoplay, setAutoplay] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAutoplay(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "idle") {
      timeout = setTimeout(() => setPhase("generating"), 900);
    } else if (phase === "generating") {
      timeout = setTimeout(() => setPhase("generated"), 1100);
    } else if (phase === "generated") {
      timeout = setTimeout(() => setPhase("posted"), 1600);
    } else if (phase === "posted") {
      timeout = setTimeout(() => setPhase("idle"), 2800);
    }

    return () => clearTimeout(timeout);
  }, [autoplay, phase]);

  function handleGenerate() {
    if (phase !== "idle") return;
    setAutoplay(false);
    setPhase("generating");
    setTimeout(() => setPhase("generated"), 1100);
  }

  function handleApprove() {
    if (phase !== "generated") return;
    setAutoplay(false);
    setPhase("posted");
  }

  function handleReplay() {
    setPhase("idle");
    setAutoplay(true);
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur"
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-xs font-medium text-slate-500">reputicious.com/dashboard</span>
      </div>

      <div className="flex">
        <div className="hidden w-14 flex-col items-center gap-4 border-r border-white/10 bg-slate-950/40 py-6 sm:flex">
          <LayoutDashboard className="h-4 w-4 text-white" />
          <MessageSquareText className="h-4 w-4 text-blue-400" />
          <MapPin className="h-4 w-4 text-slate-600" />
          <Settings className="h-4 w-4 text-slate-600" />
        </div>

        <div className="flex-1 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-violet-500 text-xs font-semibold text-white">
                JT
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{REVIEW.reviewerName}</p>
                <div className="mt-0.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("h-3 w-3", i < REVIEW.rating ? "fill-red-400 text-red-400" : "text-slate-700")}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                phase === "posted" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              )}
            >
              {phase === "posted" ? "Resolved" : "Flagged"}
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">{REVIEW.text}</p>

          <div className="mt-4 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-violet-500/5 p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-300">Claude AI draft response</span>
            </div>

            <AnimatePresence mode="wait">
              {phase === "idle" || phase === "generating" ? (
                <motion.div key="empty" exit={{ opacity: 0 }} className="py-2">
                  {phase === "generating" ? (
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-full animate-pulse rounded bg-white/10" />
                      <div className="h-2.5 w-5/6 animate-pulse rounded bg-white/10" />
                      <div className="h-2.5 w-2/3 animate-pulse rounded bg-white/10" />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Watch a response get drafted and approved, live.</p>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="text"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm leading-relaxed text-slate-200"
                >
                  {AI_RESPONSE}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-3 flex items-center gap-2">
              {phase === "idle" || phase === "generating" ? (
                <Button
                  size="sm"
                  onClick={handleGenerate}
                  disabled={phase === "generating"}
                  className="gap-1.5 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {phase === "generating" ? "Generating…" : "Generate response"}
                </Button>
              ) : phase === "generated" ? (
                <Button size="sm" onClick={handleApprove} className="gap-1.5 bg-emerald-500 text-white hover:bg-emerald-400">
                  <Send className="h-3.5 w-3.5" />
                  Approve & Post (1 click)
                </Button>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <Send className="h-3.5 w-3.5" />
                    Posted to Google in 1 click
                  </span>
                  <button
                    onClick={handleReplay}
                    className="ml-auto flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-300"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Replay
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-white/10 bg-slate-950/60 px-5 py-2.5 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        100% compliant with Google &amp; Meta platform guidelines, no scraping, no suspension risk
      </div>
    </div>
  );
}
