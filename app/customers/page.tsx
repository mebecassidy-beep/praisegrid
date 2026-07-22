import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { SocialProof } from "@/components/landing/social-proof";
import { SuccessStoriesGrid } from "@/components/customers/success-stories-grid";

export const metadata: Metadata = {
  title: "Customers — Reputicious",
  description: "See how local businesses across industries use Reputicious to turn reviews into growth.",
};

export default function CustomersPage() {
  return (
    <main>
      <Navbar />
      <SocialProof />
      <SuccessStoriesGrid />
      <Footer />
    </main>
  );
}
