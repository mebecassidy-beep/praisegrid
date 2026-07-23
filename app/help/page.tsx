import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { FaqAccordion } from "@/components/help/faq-accordion";

export const metadata: Metadata = pageMetadata({
  title: "Help Center | Praisegrid",
  description: "Answers to common questions about Praisegrid.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <main>
      <Navbar />
      <div className="bg-background py-20">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Help Center</h1>
          <p className="mt-3 text-muted-foreground">
            Common questions about Praisegrid. Can&apos;t find what you need?{" "}
            <a href="mailto:support@praisegrid.com" className="font-medium text-foreground underline underline-offset-2">
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
