"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

// Shared idle-state visual for both scan widgets: a permanently-visible but
// blurred preview of the actual result shape (a ring + a couple of stat
// bars), with a lock overlay — replaces the old empty magnifying-glass
// placeholder. On submit, this crossfades out as the real (sharp) result
// fades in, reading as the preview "unlocking" into focus.
export function BlurredPreviewLock({ pulse = false }: { pulse?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-[330px] flex-col items-center justify-center gap-6 overflow-hidden"
    >
      <div
        aria-hidden
        className={pulse ? "animate-pulse" : ""}
        style={{ filter: "blur(8px)", opacity: 0.55 }}
      >
        <div className="flex items-center gap-4">
          <div className="relative h-22 w-22 shrink-0" style={{ height: 88, width: 88 }}>
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-800" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * 0.28}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">72</div>
          </div>
          <div className="space-y-1">
            <div className="h-3 w-28 rounded bg-slate-700" />
            <div className="h-2.5 w-20 rounded bg-slate-800" />
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          {[70, 45, 85].map((w, i) => (
            <div key={i} className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-sm">
          <Lock className="h-5 w-5 text-slate-300" />
        </div>
        <p className="max-w-[220px] text-sm font-medium text-slate-300">
          {pulse ? "Unlocking your preview…" : "Enter your business to unlock your live score"}
        </p>
      </div>
    </motion.div>
  );
}
