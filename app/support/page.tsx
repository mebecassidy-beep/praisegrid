import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { SupportChat } from "@/components/support/support-chat";

export const metadata: Metadata = {
  title: "Support Center — Reputicious",
  description: "Chat with our AI support assistant, or escalate to a human on our team.",
};

export default function SupportPage() {
  return (
    <main>
      <Navbar />
      <div className="bg-background py-20">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Support Center</h1>
          <p className="mt-3 text-muted-foreground">
            Get instant answers from our AI assistant in the chat bubble below, or ask to
            talk to a human any time. Looking for common questions instead? Check the{" "}
            <a href="/help" className="font-medium text-foreground underline underline-offset-2">
              Help Center
            </a>
            .
          </p>
        </div>
      </div>
      <SupportChat />
      <Footer />
    </main>
  );
}
