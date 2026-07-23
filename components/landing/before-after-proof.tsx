"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, MapPin, Star } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export interface VerticalExample {
  industry: string;
  businessName: string;
  searchTerm: string;
  before: { rating: number; points: string[] };
  after: { rating: number; points: string[] };
}

export const EXAMPLES: VerticalExample[] = [
  {
    industry: "Plumbing",
    businessName: "Sac Valley Plumbing",
    searchTerm: "plumbers near me",
    before: {
      rating: 3.8,
      points: ["12 unanswered reviews", 'Ranked #7 for "plumbers near me"', "Average response time: never"],
    },
    after: {
      rating: 4.9,
      points: [
        "100% response rate in under 24h",
        'Top 3 local pack for "plumbers near me"',
        "Every review answered on-brand, automatically",
      ],
    },
  },
  {
    industry: "Restaurant",
    businessName: "The Copper Fork",
    searchTerm: "restaurants near me",
    before: {
      rating: 3.6,
      points: ["18 unanswered reviews", 'Ranked #9 for "restaurants near me"', "3 unaddressed 1-star complaints"],
    },
    after: {
      rating: 4.8,
      points: [
        "Every review answered within hours",
        'Top 3 local pack for "restaurants near me"',
        "Negative reviews caught before they go public",
      ],
    },
  },
  {
    industry: "Hair Salon",
    businessName: "Willow & Co. Salon",
    searchTerm: "hair salon near me",
    before: {
      rating: 4.0,
      points: ["9 unanswered reviews", 'Ranked #6 for "hair salon near me"', "No consistent brand voice in replies"],
    },
    after: {
      rating: 4.9,
      points: [
        "100% response rate, always on-brand",
        'Top 3 local pack for "hair salon near me"',
        "Booking link in every AI reply",
      ],
    },
  },
  {
    industry: "Auto Repair",
    businessName: "Trailhead Auto & Tire",
    searchTerm: "auto repair near me",
    before: {
      rating: 3.7,
      points: ["21 unanswered reviews", 'Ranked #8 for "auto repair near me"', "Trust concerns visible in top reviews"],
    },
    after: {
      rating: 4.8,
      points: [
        "Every complaint addressed within hours",
        'Top 3 local pack for "auto repair near me"',
        "Pricing concerns caught before they go public",
      ],
    },
  },
  {
    industry: "Dental",
    businessName: "Bright Smile Dental",
    searchTerm: "dentist near me",
    before: {
      rating: 4.1,
      points: ["14 unanswered reviews", 'Ranked #5 for "dentist near me"', "Insurance complaints unaddressed"],
    },
    after: {
      rating: 4.9,
      points: [
        "100% response rate, HIPAA-safe replies",
        'Top 3 local pack for "dentist near me"',
        "New-patient questions routed automatically",
      ],
    },
  },
  {
    industry: "Home Cleaning",
    businessName: "Clearwater Cleaning Co.",
    searchTerm: "house cleaning near me",
    before: {
      rating: 3.9,
      points: ["16 unanswered reviews", 'Ranked #9 for "house cleaning near me"', "Missed-appointment complaints piling up"],
    },
    after: {
      rating: 4.9,
      points: [
        "Every review answered same-day",
        'Top 3 local pack for "house cleaning near me"',
        "Rebooking link in every AI reply",
      ],
    },
  },
];

export function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < Math.round(rating)
              ? "h-4 w-4 fill-amber-400 text-amber-400"
              : "h-4 w-4 text-slate-700"
          }
        />
      ))}
    </div>
  );
}

export function BeforeAfterProof() {
  const [active, setActive] = useState(0);
  const example = EXAMPLES[active];

  return (
    <section className="border-b border-white/10 bg-slate-950 py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The transformation Reputicious is built to deliver
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Illustrative before/after examples for businesses like yours, see the full disclaimer below.
          </p>
        </Reveal>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex.industry}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                i === active
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              )}
            >
              {ex.industry}
            </button>
          ))}
        </div>

        <RevealGroup key={active} className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2" stagger={0.15}>
          <RevealItem>
            <div className="h-full rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Before: {example.businessName}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{example.before.rating.toFixed(1)}</span>
                <StarRow rating={example.before.rating} />
              </div>
              <ul className="mt-5 space-y-3">
                {example.before.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-slate-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="h-full rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                After: with Reputicious
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{example.after.rating.toFixed(1)}</span>
                <StarRow rating={example.after.rating} />
              </div>
              <ul className="mt-5 space-y-3">
                {example.after.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        </RevealGroup>

        <p className="mx-auto mt-6 max-w-md text-center text-xs text-slate-500">
          Illustrative example based on typical outcomes, individual results vary by business and starting point.
        </p>
      </div>
    </section>
  );
}
