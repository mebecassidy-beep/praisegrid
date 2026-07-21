import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { ScoreScanSection } from "@/components/landing/score-scan-section";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <ScoreScanSection />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
