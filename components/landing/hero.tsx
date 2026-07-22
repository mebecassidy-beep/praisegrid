"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstantReviewFixer } from "@/components/landing/instant-review-fixer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(circle at 80% 30%, rgba(139,92,246,0.25), transparent 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container relative grid gap-16 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
        <div className="flex flex-col items-start gap-6 text-left">
          <RevealGroup className="flex flex-col items-start gap-6" stagger={0.15}>
            <RevealItem>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                Powered by Claude Opus 4.8
              </div>
            </RevealItem>

            <RevealItem>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Turn every review into a{" "}
                <motion.span
                  className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
                  style={{ backgroundSize: "200% auto" }}
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  growth engine
                </motion.span>
              </h1>
            </RevealItem>

            <RevealItem>
              <p className="max-w-xl text-lg text-slate-400">
                Reputicious aggregates Google, Yelp, and Facebook reviews, drafts on-brand AI
                responses in seconds, and helps your local business win at Google Maps SEO —
                all on autopilot.
              </p>
            </RevealItem>

            <RevealItem>
              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 transition-shadow duration-300 hover:from-blue-400 hover:to-violet-500 hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    <Link href="/signup" className="gap-2">
                      Start Free Trial
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-white/5 text-white transition-shadow duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-violet-500/20"
                  >
                    <Link href="/features">View Live Demo</Link>
                  </Button>
                </motion.div>
              </div>
            </RevealItem>
          </RevealGroup>

          <Reveal delay={1}>
            <p className="text-sm text-slate-500">No credit card required · 14-day free trial</p>
          </Reveal>
        </div>

        <div className="flex justify-center lg:justify-end">
          <InstantReviewFixer />
        </div>
      </div>
    </section>
  );
}
