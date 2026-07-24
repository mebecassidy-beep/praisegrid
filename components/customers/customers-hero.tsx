import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

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
              We just launched, see the tool instead of a testimonial wall
            </div>
          </RevealItem>

          <RevealItem>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              See exactly where{" "}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                your reputation
              </span>{" "}
              stands
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="max-w-xl text-lg text-slate-400">
              Praisegrid is brand new, so instead of a page of before/after case studies, run the same
              live scan the product uses on your own business and see a real number, not a stand-in.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-violet-500"
              >
                <Link href="#simulator" className="gap-2">
                  Scan My Business
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/features">See Features</Link>
              </Button>
            </div>
          </RevealItem>

          <RevealItem>
            <p className="text-xs font-semibold text-slate-500">
              No credit card required • Cancel anytime with 1-click
            </p>
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.5} className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-sm text-slate-500">
            Pulls live Google Business Profile data when we can find your listing, otherwise shows a
            clearly-labeled benchmark estimate, never a fabricated number.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
