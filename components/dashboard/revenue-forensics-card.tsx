"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Clock, Loader2, Pencil, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/dashboard/analytics-charts";
import type { RevenueForensicsResult } from "@/lib/analytics/revenue-forensics";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const MIN_LTV = 0;
const MAX_LTV = 2000;

function LtvConfigurator({
  open,
  onClose,
  initialValue,
  rescuedThisMonth,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initialValue: number;
  rescuedThisMonth: number;
  onSaved: (value: number) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/revenue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimated_customer_value: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't save this.");
      onSaved(value);
      onClose();
    } catch (err: any) {
      setError(err.message || "Couldn't save this.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} className="max-w-sm">
      <div className="flex h-full flex-col p-6">
        <h3 className="text-lg font-semibold">Edit LTV valuation</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          What&apos;s an average customer worth to your business? Drag the slider or type an exact
          number, everything below updates instantly.
        </p>

        <div className="mt-8 rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Revenue rescued this month
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
            {formatCurrency(rescuedThisMonth * value)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {rescuedThisMonth} rescued review{rescuedThisMonth === 1 ? "" : "s"} × {formatCurrency(value)}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="ltv-slider" className="text-sm font-medium">
              Value per customer
            </label>
            <div className="relative w-28">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <input
                type="number"
                min={MIN_LTV}
                max={MAX_LTV}
                value={value}
                onChange={(e) => setValue(Math.max(MIN_LTV, Math.min(MAX_LTV, Number(e.target.value) || 0)))}
                className="h-9 w-full rounded-md border border-input bg-background pl-6 pr-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <input
            id="ltv-slider"
            type="range"
            min={MIN_LTV}
            max={MAX_LTV}
            step={5}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-emerald-500/20 accent-emerald-600"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-auto flex gap-2 pt-8">
          <Button onClick={handleSave} disabled={saving} className="flex-1 gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Save
          </Button>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

export function RevenueForensicsCard({ forensics }: { forensics: RevenueForensicsResult }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [liveValue, setLiveValue] = useState(forensics.estimatedCustomerValue);

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

  const { rescuedThisMonth, avgResponseTimeLabel, monthlyRecovery } = forensics;
  const revenueRescuedThisMonth = rescuedThisMonth * liveValue;

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
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Revenue rescued this month
              </p>
              <button
                onClick={() => setSheetOpen(true)}
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400"
              >
                <Pencil className="h-3 w-3" />
                Edit LTV
              </button>
            </div>
            <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
              {formatCurrency(revenueRescuedThisMonth)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {rescuedThisMonth} negative review{rescuedThisMonth === 1 ? "" : "s"} resolved · estimated at{" "}
              {formatCurrency(liveValue)} per rescued customer
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
          Estimated customer value is yours to set (
          <button onClick={() => setSheetOpen(true)} className="font-medium text-blue-600 hover:underline">
            edit it here
          </button>
          {" "}or in{" "}
          <Link href="/settings" className="font-medium text-blue-600 hover:underline">
            Settings
          </Link>
          ) — this dollar figure is an estimate you control, the review counts and response times above
          it are measured directly from your data.
        </p>
      </CardContent>

      <LtvConfigurator
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initialValue={liveValue}
        rescuedThisMonth={rescuedThisMonth}
        onSaved={(value) => {
          setLiveValue(value);
          router.refresh();
        }}
      />
    </Card>
  );
}
