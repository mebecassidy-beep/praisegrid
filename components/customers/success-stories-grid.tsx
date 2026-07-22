"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { FilterPills } from "@/components/shared/filter-pills";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { EXAMPLES, StarRow, type VerticalExample } from "@/components/landing/before-after-proof";

type Industry = VerticalExample["industry"] | "All";

function StoryCard({ example }: { example: VerticalExample }) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{example.industry}</p>
      <p className="mt-1 text-sm font-medium text-white">{example.businessName}</p>

      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-red-400">Before</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">{example.before.rating.toFixed(1)}</span>
              <StarRow rating={example.before.rating} />
            </div>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {example.before.points.map((point) => (
              <li key={point} className="flex items-start gap-1.5 text-xs text-slate-300">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400">After</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">{example.after.rating.toFixed(1)}</span>
              <StarRow rating={example.after.rating} />
            </div>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {example.after.points.map((point) => (
              <li key={point} className="flex items-start gap-1.5 text-xs text-slate-300">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SuccessStoriesGrid() {
  const [industry, setIndustry] = useState<Industry>("All");

  const filtered = industry === "All" ? EXAMPLES : EXAMPLES.filter((e) => e.industry === industry);

  const options: { value: Industry; label: string }[] = [
    { value: "All", label: "All industries" },
    ...EXAMPLES.map((e) => ({ value: e.industry as Industry, label: e.industry })),
  ];

  return (
    <section className="bg-slate-950 py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Real transformation, not a mockup
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            This is what local businesses like yours look like before and after Reputicious.
          </p>
        </Reveal>

        <div className="mx-auto mt-8 flex max-w-3xl justify-center">
          <FilterPills options={options} active={industry} onChange={setIndustry} />
        </div>

        <RevealGroup
          key={industry}
          className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {filtered.map((example) => (
            <RevealItem key={example.industry}>
              <StoryCard example={example} />
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-8 max-w-md text-center text-xs text-slate-500">
          Illustrative example based on typical outcomes — individual results vary by business and starting point.
        </p>
      </div>
    </section>
  );
}
