import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { SocialProof } from "@/components/landing/social-proof";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { MissionHero } from "@/components/about/mission-hero";
import { ProblemSection } from "@/components/about/problem-section";
import { ManifestoSection } from "@/components/about/manifesto-section";
import { PillarsSection } from "@/components/about/pillars-section";
import { ValuesSection } from "@/components/about/values-section";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "About — Reputicious",
  description:
    "Reputicious exists to make review management fast, authentic, and manageable for local businesses.",
};

export default function AboutPage() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <MissionHero />
      <ProblemSection />
      <ManifestoSection />
      <SocialProof />
      <PillarsSection />
      <ValuesSection />
      <AboutCta />
      <Footer />
    </main>
  );
}
