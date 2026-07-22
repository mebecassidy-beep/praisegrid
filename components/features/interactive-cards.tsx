"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Globe2, MessageCircleWarning, Puzzle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    icon: Globe2,
    title: "Every platform, one inbox",
    description: "Google, Yelp, and Facebook reviews land in a single feed — no more tab-switching.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Building2,
    title: "Franchise & multi-location view",
    description: "Compare every location side by side and spot which one needs attention first.",
    gradient: "from-violet-500 to-fuchsia-400",
  },
  {
    icon: MessageCircleWarning,
    title: "Urgent review routing",
    description: "Low-star reviews with high-risk language get flagged for immediate human review.",
    gradient: "from-rose-500 to-orange-400",
  },
  {
    icon: Puzzle,
    title: "Embeddable review widget",
    description: "Show your best reviews on your own site with a drop-in, on-brand widget.",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: Smartphone,
    title: "Mobile alerts",
    description: "Get notified the moment a new review comes in, wherever you are.",
    gradient: "from-amber-500 to-orange-400",
  },
];

export function InteractiveCards() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative bg-slate-950 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            And the details that make it feel effortless
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Small touches that add up to a dashboard your whole team actually wants to use.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {CARDS.map((card, i) => (
            <RevealItem key={card.title}>
              <Card
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "group h-full border-white/10 bg-white/[0.03] transition-all duration-300",
                  hovered === i ? "-translate-y-1 border-white/20 shadow-xl shadow-black/20" : ""
                )}
              >
                <CardHeader>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${card.gradient} shadow-sm transition-transform duration-300 ${
                      hovered === i ? "scale-110" : ""
                    }`}
                  >
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="pt-4 text-lg text-white">{card.title}</CardTitle>
                  <CardDescription className="leading-relaxed text-slate-400">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2} className="mx-auto mt-16 flex max-w-md flex-col items-center gap-3 text-center">
          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-violet-500"
          >
            <Link href="/signup">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs font-semibold text-slate-500">
            No credit card required • Cancel anytime with 1-click
          </p>
          <p className="text-xs text-slate-600">
            Setup takes under 3 minutes — connect your Google Business Profile in 2 clicks
          </p>
        </Reveal>
      </div>
    </section>
  );
}
