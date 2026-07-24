import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { CustomersHero } from "@/components/customers/customers-hero";
import { ReputationSimulator } from "@/components/customers/reputation-simulator";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = pageMetadata({
  title: "Customers | Praisegrid",
  description:
    "Run a live reputation scan on your own business and see a real Reputation Score, not a fabricated case study.",
  path: "/customers",
});

export default function CustomersPage() {
  return (
    <main>
      <Navbar />
      <CustomersHero />
      <ReputationSimulator />
      <AboutCta />
      <Footer />
    </main>
  );
}
