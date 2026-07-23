import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { CustomersHero } from "@/components/customers/customers-hero";
import { TransformationGrid } from "@/components/customers/transformation-grid";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "Customers | Praisegrid",
  description:
    "Real before & after transformations from local businesses across Home Services, Restaurants, Medical, and Retail using Praisegrid.",
};

export default function CustomersPage() {
  return (
    <main>
      <Navbar />
      <CustomersHero />
      <TransformationGrid />
      <AboutCta />
      <Footer />
    </main>
  );
}
