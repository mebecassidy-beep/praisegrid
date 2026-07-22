import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { FeaturesSandbox } from "@/components/landing/features-sandbox";
import { MapRankSimulator } from "@/components/landing/map-rank-simulator";
import { StickyScrollShowcase } from "@/components/features/sticky-scroll-showcase";
import { InteractiveCards } from "@/components/features/interactive-cards";

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
      <Footer />
    </main>
  );
}
