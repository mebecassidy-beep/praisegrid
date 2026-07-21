"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2, Sparkles, Star, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Link2,
    title: "Connect your platforms",
    description:
      "Link your Google Business Profile, Yelp, and Facebook pages in a few clicks. Every new review starts flowing in immediately.",
  },
  {
    icon: Sparkles,
    title: "AI drafts your reply",
    description:
      "Claude drafts a response trained on your brand voice and past replies — ready to approve, edit, or regenerate in one click.",
  },
  {
    icon: TrendingUp,
    title: "Track growth over time",
    description:
      "Watch your average rating, response rate, and sentiment trend upward as every review gets a fast, thoughtful reply.",
  },
];

function StepPreview({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="space-y-3">
        {[
          { name: "Google Business Profile", color: "#4285F4", connected: true },
          { name: "Yelp", color: "#FF1A1A", connected: true },
          { name: "Facebook", color: "#1877F2", connected: false },
        ].map((platform) => (
          <div
            key={platform.name}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: platform.color }} />
              <span className="text-sm font-medium text-slate-200">{platform.name}</span>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                platform.connected ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-slate-400"
              )}
            >
              {platform.connected ? "Connected" : "Connect"}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-violet-500 text-xs font-semibold text-white">
            DO
          </div>
          <div className="flex-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 2 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              {Array.from({ length: 3 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-slate-700" />
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Waited 40 minutes past my reservation, no apology.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-violet-500/5 p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400">Claude AI Draft</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-200">
            Hi Daniel, thank you for the honest feedback — I&apos;m sorry about the wait. I&apos;d
            like to make this right, please reach out directly...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Avg. rating", value: "4.8", delta: "+0.3" },
          { label: "Response rate", value: "97%", delta: "+12%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-emerald-400">{stat.delta} this quarter</p>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1.5">
        {[38, 52, 44, 61, 70, 66, 82, 91].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[3px] bg-gradient-to-t from-blue-500 to-violet-400"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-slate-950 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From new review to posted reply in under a minute
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            No new tools to learn. Reputicious slots into how you already manage your business.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <button
                key={step.title}
                onClick={() => setActive(i)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-colors",
                  active === i
                    ? "border-blue-500/40 bg-white/5"
                    : "border-white/10 bg-transparent hover:bg-white/[0.03]"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br transition-opacity",
                    active === i ? "from-blue-500 to-violet-600 opacity-100" : "from-slate-700 to-slate-800 opacity-70"
                  )}
                >
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-violet-500/10 to-transparent blur-2xl" />
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <StepPreview step={active} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-4 flex justify-center gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show step ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    active === i ? "w-6 bg-blue-500" : "w-1.5 bg-white/20"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
