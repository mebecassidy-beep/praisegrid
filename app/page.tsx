import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { DashboardPreviewSection } from "@/components/landing/dashboard-preview-section";
import { SocialProof } from "@/components/landing/social-proof";
import { ScoreScanSection } from "@/components/landing/score-scan-section";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { FomoTicker } from "@/components/landing/fomo-ticker";
import { ExitIntentModal } from "@/components/landing/exit-intent-modal";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <DashboardPreviewSection />
      <SocialProof />
      <ScoreScanSection />
      <Features />
      <Pricing />
      <Footer />
      <FomoTicker />
      <ExitIntentModal />
    </main>
  );
}
