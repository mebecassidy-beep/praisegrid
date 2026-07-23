"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, FlaskConical, TrendingUp } from "lucide-react";
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

// This whole page is preview/sandbox data - representative examples, not
// live records of real accounts. Estimated per rescued review, same $275
// default the real Reputation Revenue Forensics feature ships with.
const ESTIMATED_VALUE_PER_RESCUED_REVIEW = 275;
const isSandboxPreview = true;

function healthStatusFor(example: TransformationExample): { label: string; className: string } {
  if (example.before.rating < 3.8) {
    return { label: "Recovered", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
  }
  return { label: "Promoter", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    amount
  );
}

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
  const health = healthStatusFor(example);
  const revenueSaved = example.reviewsRescued * ESTIMATED_VALUE_PER_RESCUED_REVIEW;

  return (
    <div className="group relative h-full rounded-2xl bg-gradient-to-br from-blue-500/40 via-violet-500/25 to-white/5 p-px transition-all duration-300 hover:scale-[1.01] hover:from-blue-400/70 hover:via-violet-400/50 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex h-full flex-col rounded-[15px] bg-slate-900/95 p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {example.category}
          </span>
          <span className="text-[11px] font-medium text-slate-500">{example.industry}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-white">{example.businessName}</p>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${health.className}`}>
            {health.label}
          </span>
        </div>

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

        <div className="mt-2.5 rounded-lg border border-emerald-500/15 bg-emerald-500/5 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-500/80">
            Est. revenue saved
          </p>
          <p className="mt-0.5 text-sm font-semibold text-emerald-400">
            {formatCurrency(revenueSaved)}{" "}
            <span className="font-normal text-slate-500">
              · {example.reviewsRescued} negative review{example.reviewsRescued === 1 ? "" : "s"} rescued
            </span>
          </p>
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

        <p className="mt-3 text-[11px] text-slate-500">
          <span className="text-emerald-500">●</span> Auto-drafted response sent {example.after.responseTime.toLowerCase()}
        </p>

        <Link
          href="/signup"
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
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
          {isSandboxPreview && (
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <FlaskConical className="h-3.5 w-3.5" />
              Preview sandbox &middot; representative examples, not live customer data
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What this kind of turnaround actually looks like
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
