"use client";

import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const LOST_CUSTOMER_RATE = 0.12; // share of potential customers deterred by unanswered/negative reviews
const PLAN_PRICE = 97;

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function CostCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState(300);
  const [customerValue, setCustomerValue] = useState(120);

  const lostCustomers = Math.round(monthlyLeads * LOST_CUSTOMER_RATE);
  const monthlyLoss = lostCustomers * customerValue;
  const netGain = monthlyLoss - PLAN_PRICE;

  return (
    <Reveal className="mx-auto mt-16 max-w-2xl">
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold">What is inaction costing you?</h3>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Potential customers who check reviews per month</span>
              <span className="font-semibold tabular-nums">{monthlyLeads.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={50}
              max={2000}
              step={10}
              value={monthlyLeads}
              onChange={(e) => setMonthlyLeads(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average value of a new customer</span>
              <span className="font-semibold tabular-nums">{formatCurrency(customerValue)}</span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={customerValue}
              onChange={(e) => setCustomerValue(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-red-600">
              Est. monthly revenue lost
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-red-600">
              {formatCurrency(monthlyLoss)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ~{lostCustomers.toLocaleString()} customers/mo deterred by unanswered or negative reviews
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
              Reputicious Pro
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-600">
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
          studies — an estimate to illustrate impact, not a guarantee for your business.
        </p>
      </div>
    </Reveal>
  );
}
