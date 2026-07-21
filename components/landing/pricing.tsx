"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter",
    monthly: 49,
    description: "For single-location businesses getting started with review management.",
    features: [
      "1 business location",
      "Google + Yelp sync",
      "AI-drafted responses (100/mo)",
      "Basic sentiment analytics",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    monthly: 97,
    description: "For growing brands that need automation and deeper insights.",
    features: [
      "Up to 5 business locations",
      "Google, Yelp + Facebook sync",
      "Unlimited AI-drafted responses",
      "Auto-approve rules engine",
      "Advanced sentiment analytics",
      "Priority support",
    ],
    highlighted: true,
  },
];

const ANNUAL_DISCOUNT = 0.2;

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="bg-muted/40 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free for 14 days. No credit card required, cancel anytime.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <span className={cn("text-sm font-medium", !annual && "text-foreground", annual && "text-muted-foreground")}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual pricing" />
          <span className={cn("flex items-center gap-2 text-sm font-medium", annual && "text-foreground", !annual && "text-muted-foreground")}>
            Annual
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              Save 20%
            </span>
          </span>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {TIERS.map((tier) => {
            const price = annual ? Math.round(tier.monthly * (1 - ANNUAL_DISCOUNT)) : tier.monthly;

            return (
              <Card
                key={tier.name}
                className={cn(
                  "relative flex flex-col",
                  tier.highlighted && "border-2 border-blue-500 shadow-lg shadow-blue-500/10"
                )}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-3 py-1 text-xs font-semibold text-white shadow">
                    Most Popular
                  </span>
                )}

                <CardHeader className="pb-0">
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">${price}</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-muted-foreground">
                      Billed ${price * 12} annually
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between gap-6 pt-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "w-full",
                      tier.highlighted &&
                        "bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
                    )}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
