"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface TierMetric {
  label: string;
  value: string;
  fill: number;
}

export interface TierDetail {
  name: string;
  price: number;
  description: string;
  highlighted: boolean;
  metrics: TierMetric[];
  features: string[];
}

export function PricingDetailSheet({
  tier,
  open,
  onClose,
}: {
  tier: TierDetail | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!tier) return null;

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex-1 space-y-8 overflow-y-auto p-8 pt-14">
        <div>
          {tier.highlighted && (
            <span className="mb-3 inline-block rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-2.5 py-1 text-xs font-semibold text-white">
              Most Popular
            </span>
          )}
          <h2 className="text-2xl font-bold tracking-tight">{tier.name} plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
          <p className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">${tier.price}</span>
            <span className="text-sm text-muted-foreground">/mo</span>
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What&apos;s included
          </h3>
          <div className="space-y-4">
            {tier.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground/90">{metric.label}</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      tier.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-violet-600"
                        : "bg-blue-500"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.fill}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Full feature list
          </h3>
          <ul className="space-y-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span className="text-foreground/90">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          asChild
          size="lg"
          className={cn(
            "w-full",
            tier.highlighted &&
              "bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
          )}
        >
          <Link href="/signup">Start free trial with {tier.name}</Link>
        </Button>
      </div>
    </Sheet>
  );
}
