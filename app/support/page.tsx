import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { SupportChatPanel } from "@/components/support/support-chat-panel";
import { ContactCards } from "@/components/support/contact-cards";

export const metadata: Metadata = {
  title: "Support Center — Reputicious",
  description:
    "Chat with our AI support assistant for instant answers, or reach the team directly at support@reputicious.com.",
};

export default function SupportPage() {
  return (
    <main className="bg-slate-950">
      <Navbar />
      <div className="border-b border-white/10 py-16 sm:py-20">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Support Center
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-400">
            Try the live chat agent below, it handles most questions about your reviews,
            pricing, and account instantly. For anything else, our team is one email away.
          </p>
        </div>
      </div>

      <div className="py-12 sm:py-16">
        <div className="container grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          <SupportChatPanel />
          <ContactCards />
        </div>
      </div>

      <Footer />
    </main>
  );
}
