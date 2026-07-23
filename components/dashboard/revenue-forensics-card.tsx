"use client";

import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/dashboard/analytics-charts";
import type { RevenueForensicsResult } from "@/lib/analytics/revenue-forensics";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RevenueForensicsCard({ forensics }: { forensics: RevenueForensicsResult }) {
  if (!forensics.hasAnyRescuedReview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Reputation Revenue Forensics
          </CardTitle>
          <CardDescription>
            What resolving your negative reviews is estimated to be worth, based on your own numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/20 py-10 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </span>
            <div>
              <p className="text-sm font-semibold">No rescued reviews yet</p>
              <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
                Approve and post a response to a 1 or 2-star review and this card starts tracking what
                that recovery is worth.
              </p>
            </div>
            <Link
              href="/reviews"
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
            >
              Go resolve a review
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { rescuedThisMonth, revenueRescuedThisMonth, estimatedCustomerValue, avgResponseTimeLabel, monthlyRecovery } =
    forensics;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Reputation Revenue Forensics
        </CardTitle>
        <CardDescription>
          What resolving your negative reviews is estimated to be worth, based on your own numbers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Revenue rescued this month
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
              {formatCurrency(revenueRescuedThisMonth)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {rescuedThisMonth} negative review{rescuedThisMonth === 1 ? "" : "s"} resolved · estimated at{" "}
              {formatCurrency(estimatedCustomerValue)} per rescued customer
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Avg. response time
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{avgResponseTimeLabel ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across every rescued negative review</p>
          </div>
        </div>

        {monthlyRecovery.length >= 2 ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Review recovery volume
            </p>
            <LineChart
              values={monthlyRecovery.map((m) => m.count)}
              labels={monthlyRecovery.map((m) => m.month)}
              formatValue={(v) => `${v} rescued`}
              stroke="#10b981"
            />
          </div>
        ) : null}

        <p className="text-xs text-muted-foreground">
          Estimated customer value is set in{" "}
          <Link href="/settings" className="font-medium text-blue-600 hover:underline">
            Settings
          </Link>{" "}
          — this dollar figure is an estimate you control, the review counts and response times above it
          are measured directly from your data.
        </p>
      </CardContent>
    </Card>
  );
}
