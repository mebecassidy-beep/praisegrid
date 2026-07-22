import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { FeaturesSandbox } from "@/components/landing/features-sandbox";
import { MapRankSimulator } from "@/components/landing/map-rank-simulator";
import { StickyScrollShowcase } from "@/components/features/sticky-scroll-showcase";
import { InteractiveCards } from "@/components/features/interactive-cards";
import { StickyCtaBar } from "@/components/features/sticky-cta-bar";
import { ObjectionFaq } from "@/components/landing/objection-faq";

export const metadata: Metadata = {
  title: "Features — Reputicious",
  description:
    "See Reputicious in action: paste a real customer complaint and watch our AI draft an elite, on-brand response instantly.",
};

export default function FeaturesPage() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <FeaturesSandbox />
      <MapRankSimulator />
      <StickyScrollShowcase />
      <InteractiveCards />
      <ObjectionFaq />
      <Footer />
      <StickyCtaBar />
    </main>
  );
}
