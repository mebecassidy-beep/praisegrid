import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Reveal } from "@/components/motion/reveal";
import { MapRankSimulator } from "@/components/landing/map-rank-simulator";
import { CinematicShowcase } from "@/components/features/cinematic-showcase";
import { ComplianceShieldBanner } from "@/components/features/compliance-shield-banner";
import { InteractiveCards } from "@/components/features/interactive-cards";
import { ObjectionFaq } from "@/components/landing/objection-faq";

export const metadata: Metadata = pageMetadata({
  title: "Features | Praisegrid",
  description:
    "See the actual Praisegrid dashboard: Autonomous Crisis Shield, Claude Opus Brand Voice, and Local Competitor Radar.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />

      {/* Dark is reserved for this opening statement + the product-shot
          reveal right after it - everything below breathes in light so the
          page isn't black end to end. */}
      <section className="relative overflow-hidden bg-surface-dark py-24 sm:py-32">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              The dashboard, up close
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Built to actually run your reputation, not just report on it
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              Three systems doing the real work behind the scenes: catching a crisis the second it
              happens, drafting replies that sound like you, and watching your competitors so you
              don&apos;t have to.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-opacity hover:opacity-90"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CinematicShowcase />
      <ComplianceShieldBanner />
      <MapRankSimulator />
      <InteractiveCards />
      <ObjectionFaq />
      <Footer />
    </main>
  );
}
