"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PricingDetailSheet, type TierDetail } from "@/components/landing/pricing-detail-sheet";
import { cn } from "@/lib/utils";

const TIERS: TierDetail[] = [
  {
    name: "Starter",
    price: 49,
    description: "For single-location businesses getting started with review management.",
    features: [
      "1 business location",
      "Google review sync (5 most recent, daily)",
      "AI-drafted responses (100/mo)",
      "Fake review dispute drafting",
      "Feedback Shield private-first funnel",
      "One-tap review request blasts",
      "QR codes & table tents",
      "Email support",
    ],
    metrics: [
      { label: "Business locations", value: "1", fill: 20 },
      { label: "AI-drafted responses", value: "100/mo", fill: 35 },
      { label: "Platforms synced", value: "Google (Yelp, Facebook coming soon)", fill: 40 },
    ],
    highlighted: false,
    activationLine: "⚡ Live in 90 seconds, connect Google, done.",
  },
  {
    name: "Pro",
    price: 97,
    description: "For growing brands that need automation and deeper insights.",
    features: [
      "Up to 5 business locations & Franchise View",
      "Google review sync (5 most recent, daily)",
      "Unlimited AI-drafted responses",
      "Auto-approve rules engine",
      "Competitor benchmarking & leak finder",
      "Revenue Forensics ROI calculator",
      "Crisis Shield: Slack + SMS alerts",
      "Social Auto-Pilot",
      "Priority support",
    ],
    metrics: [
      { label: "Business locations", value: "Up to 5", fill: 100 },
      { label: "AI-drafted responses", value: "Unlimited", fill: 100 },
      { label: "Platforms synced", value: "Google (Yelp, Facebook coming soon)", fill: 40 },
    ],
    highlighted: true,
    activationLine: "Everything unlimited, no per-location fees, no usage caps.",
  },
];

const ANNUAL_DISCOUNT = 0.2;

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [activeTier, setActiveTier] = useState<TierDetail | null>(null);

  return (
    <section id="pricing" className="bg-muted/40 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free for 14 days. No credit card required, cancel anytime.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex items-center justify-center gap-3">
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
        </Reveal>

        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2" stagger={0.12}>
          {TIERS.map((tier) => {
            const price = annual ? Math.round(tier.price * (1 - ANNUAL_DISCOUNT)) : tier.price;

            return (
              <RevealItem key={tier.name}>
                <motion.div
                  className="h-full"
                  whileHover={{ y: -6 }}
                  whileTap={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                <Card
                  className={cn(
                    "relative flex h-full flex-col transition-shadow duration-300 hover:shadow-xl",
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
                    <div className="mt-4 flex items-baseline gap-1 overflow-hidden">
                      <span className="text-4xl font-bold tracking-tight">
                        $
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={price}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block"
                          >
                            {price}
                          </motion.span>
                        </AnimatePresence>
                      </span>
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

                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      100% compliant with Google &amp; Meta platform guidelines, zero suspension risk
                    </p>

                    <div className="space-y-2">
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
                      {tier.activationLine && (
                        <p className="text-center text-xs font-semibold text-foreground/90">
                          {tier.activationLine}
                        </p>
                      )}
                      <p className="text-center text-[11px] text-muted-foreground">
                        🔒 No card required · ↩ Cancel anytime, 1-click · 💳 Payments secured by Stripe
                      </p>
                      <button
                        onClick={() => setActiveTier(tier)}
                        className="flex w-full items-center justify-center gap-1 rounded-md py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        See full details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>

      <PricingDetailSheet tier={activeTier} open={activeTier !== null} onClose={() => setActiveTier(null)} />
    </section>
  );
}
