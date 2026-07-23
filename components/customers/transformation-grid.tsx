"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterPills } from "@/components/shared/filter-pills";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BeforeAfterSlider } from "@/components/customers/before-after-slider";
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
    return { label: "Recovered", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
  }
  return { label: "Promoter", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    amount
  );
}

function TransformationCard({ example }: { example: TransformationExample }) {
  const health = healthStatusFor(example);
  const revenueSaved = example.reviewsRescued * ESTIMATED_VALUE_PER_RESCUED_REVIEW;

  return (
    <div className="group relative h-full rounded-2xl bg-brand-gradient-br p-px transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex h-full flex-col rounded-[15px] bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {example.category}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">{example.industry}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-base font-semibold">{example.businessName}</p>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${health.className}`}>
            {health.label}
          </span>
        </div>

        <div className="mt-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
            Est. revenue saved
          </p>
          <p className="mt-0.5 text-sm font-semibold text-emerald-600">
            {formatCurrency(revenueSaved)}{" "}
            <span className="font-normal text-muted-foreground">
              · {example.reviewsRescued} negative review{example.reviewsRescued === 1 ? "" : "s"} rescued
            </span>
          </p>
        </div>

        <div className="mt-4">
          <BeforeAfterSlider example={example} />
          <p className="mt-1.5 text-center text-[10px] font-medium text-muted-foreground">
            Drag to compare before &amp; after
          </p>
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground">
          <span className="text-emerald-500">●</span> Auto-drafted response sent {example.after.responseTime.toLowerCase()}
        </p>

        <Link
          href="/signup"
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-500"
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
    <section className="bg-background py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          {isSandboxPreview && (
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600">
              <FlaskConical className="h-3.5 w-3.5" />
              Preview sandbox &middot; representative examples, not live customer data
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What this kind of turnaround actually looks like
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
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

        <p className="mx-auto mt-8 max-w-md text-center text-xs text-muted-foreground">
          Illustrative example based on typical outcomes, individual results vary by business and starting point.
        </p>

        <div className="mx-auto mt-10 flex max-w-lg flex-col items-center gap-3 rounded-2xl border bg-muted/30 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold">See your own before &amp; after.</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Start your 14-day free trial, no credit card required.</p>
          </div>
          <Button
            asChild
            className="w-full shrink-0 gap-2 bg-brand-gradient text-white hover:opacity-90 sm:w-auto"
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
