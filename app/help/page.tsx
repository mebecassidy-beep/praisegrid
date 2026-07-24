import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { HelpCenter } from "@/components/help/help-center";

export const metadata: Metadata = pageMetadata({
  title: "Help Center | Praisegrid",
  description: "Search or browse answers to common questions about Praisegrid.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <main>
      <Navbar />
      <HelpCenter />
      <Footer />
    </main>
  );
}
