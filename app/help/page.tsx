import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { FaqAccordion } from "@/components/help/faq-accordion";

export const metadata: Metadata = {
  title: "Help Center — Reputicious",
  description: "Answers to common questions about Reputicious.",
};

export default function HelpPage() {
  return (
    <main>
      <Navbar />
      <div className="bg-background py-20">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Help Center</h1>
          <p className="mt-3 text-muted-foreground">
            Common questions about Reputicious. Can&apos;t find what you need?{" "}
            <a href="mailto:support@reputicious.com" className="font-medium text-foreground underline underline-offset-2">
              Email support
            </a>{" "}
            or visit our{" "}
            <a href="/support" className="font-medium text-foreground underline underline-offset-2">
              Support Center
            </a>{" "}
            to chat with us.
          </p>

          <div className="mt-10">
            <FaqAccordion />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
