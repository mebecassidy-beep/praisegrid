"use client";

import { useState } from "react";
import { Check, RefreshCw, Send, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DRAFTS = [
  "Thank you so much, Sarah! We're thrilled the team could make your visit special — your kind words mean a lot to us. We can't wait to welcome you back soon!",
  "Wow, thank you Sarah! Comments like this make our day. We'll be sure to pass your kind words along to the whole team. See you again soon!",
  "We really appreciate you taking the time to share this, Sarah! Delivering an above-and-beyond experience is exactly what we aim for. Hope to see you again!",
];

export function HeroPreview() {
  const [draftIndex, setDraftIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [posted, setPosted] = useState(false);

  function handleRegenerate() {
    if (generating) return;
    setGenerating(true);
    setPosted(false);
    setTimeout(() => {
      setDraftIndex((i) => (i + 1) % DRAFTS.length);
      setGenerating(false);
    }, 700);
  }

  function handleApprove() {
    setPosted(true);
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/30 via-violet-500/20 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-xs font-medium text-slate-300">Google Business Profile</span>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            Live sync
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-violet-500 text-sm font-semibold text-white">
              SM
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Sarah Mitchell</p>
                <span className="text-[11px] text-slate-500">2h ago</span>
              </div>
              <div className="mt-0.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Amazing service! The team went above and beyond to make sure everything
                was perfect. Highly recommend to anyone in the area.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-violet-500/5 p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">Claude AI Draft Response</span>
            </div>
            <p
              className={cn(
                "text-sm leading-relaxed text-slate-200 transition-opacity duration-300",
                generating && "opacity-30"
              )}
            >
              {DRAFTS[draftIndex]}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleApprove}
                disabled={posted}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  posted
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-white text-slate-900 hover:bg-slate-200"
                )}
              >
                {posted ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                {posted ? "Posted to Google" : "Approve & Post"}
              </button>
              <button
                onClick={handleRegenerate}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/5"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", generating && "animate-spin")} />
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
