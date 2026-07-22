"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Star, ThumbsUp } from "lucide-react";

export function MapSyncVisual() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => p + 1), 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Google Business Profile</span>
        <span className="flex items-center gap-1 text-emerald-400">
          <motion.span
            key={pulse}
            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.4 }}
          />
          Synced live
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {[
          { name: "Riverside Location", rating: 4.9, count: 214 },
          { name: "Downtown Location", rating: 4.7, count: 158 },
          { name: "Northgate Location", rating: 4.8, count: 96 },
        ].map((loc, i) => (
          <motion.div
            key={loc.name}
            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5"
            animate={{ backgroundColor: ["rgba(255,255,255,0.05)", "rgba(59,130,246,0.12)", "rgba(255,255,255,0.05)"] }}
            transition={{ duration: 2.4, delay: i * 0.6, repeat: Infinity, repeatDelay: 3.2 }}
          >
            <span className="text-sm font-medium text-slate-200">{loc.name}</span>
            <span className="flex items-center gap-1 text-sm text-slate-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {loc.rating}
              <span className="text-slate-500">({loc.count})</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const REVIEW_CYCLE = [
  {
    reviewer: "Marcus T.",
    complaint: "Order was wrong and no one apologized.",
    response:
      "Marcus, I'm sorry we got this wrong and that no one made it right in the moment. That's on us. Please reach out directly so we can fix it. — Owner",
  },
  {
    reviewer: "Dana R.",
    complaint: "Took forever to get seated even with a reservation.",
    response:
      "Dana, that wait shouldn't have happened, especially with a reservation. I'd like to make it right — please reach out so we can. — Owner",
  },
];

export function BrandVoiceVisual() {
  const [index, setIndex] = useState(0);
  const [drafting, setDrafting] = useState(true);

  useEffect(() => {
    const draftTimer = setTimeout(() => setDrafting(false), 1200);
    const cycleTimer = setTimeout(() => {
      setIndex((i) => (i + 1) % REVIEW_CYCLE.length);
      setDrafting(true);
    }, 4200);
    return () => {
      clearTimeout(draftTimer);
      clearTimeout(cycleTimer);
    };
  }, [index]);

  const current = REVIEW_CYCLE[index];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-2xl backdrop-blur">
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold text-red-400">★☆☆☆☆ {current.reviewer}</p>
        <p className="mt-1 text-sm text-slate-400">&ldquo;{current.complaint}&rdquo;</p>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span className="h-px flex-1 bg-white/10" />
        Claude drafts a reply
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="mt-3 min-h-[92px] rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-4">
        <AnimatePresence mode="wait">
          {drafting ? (
            <motion.div key="drafting" exit={{ opacity: 0 }} className="space-y-1.5">
              <div className="h-2.5 w-full animate-pulse rounded bg-white/10" />
              <div className="h-2.5 w-5/6 animate-pulse rounded bg-white/10" />
              <div className="h-2.5 w-2/3 animate-pulse rounded bg-white/10" />
            </motion.div>
          ) : (
            <motion.p
              key="text"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm leading-relaxed text-slate-200"
            >
              {current.response}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AutoApproveVisual() {
  const [posted, setPosted] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => setPosted((p) => p + 1), 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-2xl backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Auto-approve rules</p>
      <div className="mt-4 space-y-3">
        {[
          { label: "5-star reviews", on: true },
          { label: "4-star, no complaint keywords", on: true },
          { label: "1–2 star reviews", on: false },
        ].map((rule) => (
          <div key={rule.label} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
            <span className="text-sm text-slate-200">{rule.label}</span>
            <span
              className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                rule.on ? "justify-end bg-emerald-500" : "justify-start bg-slate-700"
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-white" />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <AnimatePresence mode="wait">
          <motion.span
            key={posted}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
          >
            {posted} responses auto-posted this week
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SentimentVisual() {
  const bars = [62, 74, 58, 81, 90, 88];
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sentiment trend</p>
        <span className="flex items-center gap-1 text-xs text-emerald-400">
          <ThumbsUp className="h-3.5 w-3.5" /> +18% this quarter
        </span>
      </div>
      <div className="mt-5 flex h-28 items-end gap-2">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-violet-500"
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">Benchmarked against 3 local competitors</p>
    </div>
  );
}
