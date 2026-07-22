import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const STATS = [
  { value: "10k+", label: "Reviews Managed" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "500+", label: "Local Businesses" },
  { value: "98%", label: "Response Rate" },
];

export function CustomersHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(59,130,246,0.22), transparent 40%), radial-gradient(circle at 75% 25%, rgba(139,92,246,0.2), transparent 42%)",
        }}
      />

      <div className="container relative py-20 lg:py-24">
        <RevealGroup className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center" stagger={0.12}>
          <RevealItem>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Real before &amp; after, by industry
            </div>
          </RevealItem>

          <RevealItem>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              See what local businesses look like{" "}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                after Reputicious
              </span>
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="max-w-xl text-lg text-slate-400">
              Home Services, Restaurants, Medical, and Retail businesses all fight the same battle —
              unanswered reviews quietly costing them customers. Here&apos;s what turning that around
              actually looks like.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-violet-500"
              >
                <Link href="/signup" className="gap-2">
                  Start Your 14-Day Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/features">See Live Demo</Link>
              </Button>
            </div>
          </RevealItem>

          <RevealItem>
            <p className="text-xs font-semibold text-slate-500">
              No credit card required • Cancel anytime with 1-click
            </p>
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.5} className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
