import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { BeforeAfterProof } from "@/components/landing/before-after-proof";
import { ScoreScanSection } from "@/components/landing/score-scan-section";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { FomoTicker } from "@/components/landing/fomo-ticker";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <BeforeAfterProof />
      <ScoreScanSection />
      <Features />
      <Pricing />
      <Footer />
      <FomoTicker />
    </main>
  );
}
