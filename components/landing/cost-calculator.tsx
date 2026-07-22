"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const LOST_CUSTOMER_RATE = 0.12; // share of potential customers deterred by unanswered/negative reviews
const AVG_CUSTOMER_VALUE = 120; // fixed assumption, kept out of the slider to keep the interaction to one control
const PLAN_PRICE = 97;

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function CostCalculator() {
  const [monthlyCustomers, setMonthlyCustomers] = useState(300);

  const recapturedCustomers = Math.round(monthlyCustomers * LOST_CUSTOMER_RATE);
  const recapturedRevenue = recapturedCustomers * AVG_CUSTOMER_VALUE;
  const netGain = recapturedRevenue - PLAN_PRICE;

  return (
    <Reveal className="mx-auto mt-16 max-w-2xl">
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold">See how much revenue you&apos;re leaving on the table</h3>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your monthly customer volume</span>
            <span className="font-semibold tabular-nums">{monthlyCustomers.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={10}
            value={monthlyCustomers}
            onChange={(e) => setMonthlyCustomers(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-blue-600"
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
              Recurring revenue Reputicious recaptures
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-600">
              {formatCurrency(recapturedRevenue)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ~{recapturedCustomers.toLocaleString()} customers/mo won back with on-time, on-brand responses
            </p>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Reputicious Pro</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-blue-600">
              {formatCurrency(PLAN_PRICE)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Net upside: {formatCurrency(Math.max(0, netGain))}/mo
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Based on a {Math.round(LOST_CUSTOMER_RATE * 100)}% deterrence rate from industry review-response
          studies and a ${AVG_CUSTOMER_VALUE} average customer value — an estimate to illustrate impact,
          not a guarantee for your business.
        </p>
      </div>
    </Reveal>
  );
}
