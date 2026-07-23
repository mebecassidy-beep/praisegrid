"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

const EVENTS = [
  "Roofing & Co. in Sacramento just automated 14 review responses",
  "Bloomfield Dental in Austin just hit a 4.9-star average",
  "Cedar & Co. Salon in Denver just claimed their business profile",
  "Harborview Auto in Tampa just intercepted a 2-star review privately",
  "Northgate Cafe in Portland just responded to 8 reviews in one click",
  "Willow Bay Realty in Phoenix just climbed into the local 3-pack",
  "Pier 12 Seafood in Miami just automated their weekly review report",
  "Summit HVAC in Denver just turned a 1-star review into a 5-star follow-up",
  "Maple Street Dental in Chicago just crossed 100 five-star reviews",
  "Coastal Cleaners in San Diego just enabled auto-approve for 5-star reviews",
  "Ironclad Roofing in Dallas just responded to a review in under 2 minutes",
  "Blue Ridge Landscaping in Charlotte just synced Google + Yelp reviews",
  "Golden Gate Movers in San Francisco just hit a 96% response rate",
  "Riverside Veterinary in Boise just generated their first AI response",
  "Twin Oaks Bakery in Nashville just claimed a top-3 local ranking",
];

const CYCLE_MS = 5000;
const DISMISS_KEY = "praisegrid_fomo_dismissed";

export function FomoTicker() {
  const [dismissed, setDismissed] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % EVENTS.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [dismissed]);

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  if (dismissed) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden max-w-xs sm:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-white/10 bg-slate-900/95 p-3.5 shadow-2xl shadow-black/40 backdrop-blur"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          </span>
          <p className="flex-1 text-xs leading-relaxed text-slate-300">{EVENTS[index]}</p>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="shrink-0 rounded-full p-0.5 text-slate-500 transition-colors hover:text-slate-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
