"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterPills } from "@/components/shared/filter-pills";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { StarRow } from "@/components/landing/before-after-proof";
import {
  CATEGORIES,
  TRANSFORMATIONS,
  type TransformationCategory,
  type TransformationExample,
} from "@/components/customers/transformation-data";

type FilterValue = TransformationCategory | "All";

function MetricTile({
  label,
  icon,
  before,
  after,
}: {
  label: string;
  icon: React.ReactNode;
  before: string;
  after: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold">
        <span className="text-slate-500 line-through decoration-slate-600">{before}</span>
        <ArrowRight className="h-3 w-3 shrink-0 text-slate-600" />
        <span className="text-emerald-400">{after}</span>
      </div>
    </div>
  );
}

function TransformationCard({ example }: { example: TransformationExample }) {
  return (
    <div className="group relative h-full rounded-2xl bg-gradient-to-br from-blue-500/40 via-violet-500/25 to-white/5 p-px transition-colors duration-300 hover:from-blue-400/70 hover:via-violet-400/50">
      <div className="flex h-full flex-col rounded-[15px] bg-slate-900/95 p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {example.category}
          </span>
          <span className="text-[11px] font-medium text-slate-500">{example.industry}</span>
        </div>

        <p className="mt-3 text-base font-semibold text-white">{example.businessName}</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <MetricTile
            label="Rating"
            icon={<TrendingUp className="h-3 w-3" />}
            before={`${example.before.rating.toFixed(1)}★`}
            after={`${example.after.rating.toFixed(1)}★`}
          />
          <MetricTile
            label="Response time"
            icon={<Clock className="h-3 w-3" />}
            before={example.before.responseTime}
            after={example.after.responseTime}
          />
        </div>

        <div className="mt-4 grid flex-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-red-400">Before</span>
              <StarRow rating={example.before.rating} />
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
              <StarRow rating={example.after.rating} />
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

        <Link
          href="/signup"
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
        >
          Get results like this for my business
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function TransformationGrid() {
  const [filter, setFilter] = useState<FilterValue>("All");

  const filtered = filter === "All" ? TRANSFORMATIONS : TRANSFORMATIONS.filter((e) => e.category === filter);

  const options: { value: FilterValue; label: string }[] = [
    { value: "All", label: `All industries (${TRANSFORMATIONS.length})` },
    ...CATEGORIES.map((c) => ({
      value: c as FilterValue,
      label: `${c} (${TRANSFORMATIONS.filter((e) => e.category === c).length})`,
    })),
  ];

  return (
    <section className="bg-slate-950 py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Real transformation, not a mockup
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Filter by industry to see the kind of star-rating recovery and response-time swing local
            businesses like yours can expect.
          </p>
        </Reveal>

        <div className="mx-auto mt-8 flex max-w-3xl justify-center">
          <FilterPills options={options} active={filter} onChange={setFilter} />
        </div>

        <RevealGroup
          key={filter}
          className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {filtered.map((example) => (
            <RevealItem key={example.businessName}>
              <TransformationCard example={example} />
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-8 max-w-md text-center text-xs text-slate-500">
          Illustrative example based on typical outcomes, individual results vary by business and starting point.
        </p>

        <div className="mx-auto mt-10 flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold text-white">See your own before &amp; after.</p>
            <p className="mt-0.5 text-xs text-slate-400">Start your 14-day free trial, no credit card required.</p>
          </div>
          <Button
            asChild
            className="w-full shrink-0 gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500 sm:w-auto"
          >
            <Link href="/signup">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
