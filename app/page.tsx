import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ConversionVideoPlaceholder } from "@/components/landing/conversion-video-placeholder";
import { StandoutFeatures } from "@/components/landing/standout-features";
import { RoiCalculatorSection } from "@/components/landing/roi-calculator-section";
import { DashboardPreviewSection } from "@/components/landing/dashboard-preview-section";
import { SocialProof } from "@/components/landing/social-proof";
import { ScoreScanSection } from "@/components/landing/score-scan-section";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { ObjectionFaq } from "@/components/landing/objection-faq";
import { Footer } from "@/components/landing/footer";
import { FomoTicker } from "@/components/landing/fomo-ticker";
import { ExitIntentModal } from "@/components/landing/exit-intent-modal";

export default function HomePage() {
  const googlePlacesEnabled = Boolean(process.env.GOOGLE_PLACES_API_KEY);

  return (
    <main>
      <Navbar />
      <Hero />
      <ConversionVideoPlaceholder />
      <StandoutFeatures />
      <RoiCalculatorSection />
      <DashboardPreviewSection />
      <SocialProof />
      <ScoreScanSection googlePlacesEnabled={googlePlacesEnabled} />
      <Features />
      <Pricing />
      <ObjectionFaq />
      <Footer />
      <FomoTicker />
      <ExitIntentModal />
    </main>
  );
}
