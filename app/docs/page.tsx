import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import { ComingSoonPage } from "@/components/simple/coming-soon";

export const metadata: Metadata = {
  title: "API Docs — Reputicious",
  description: "Public API access for Reputicious is coming soon.",
};

export default function DocsPage() {
  return (
    <ComingSoonPage
      icon={Code2}
      eyebrow="API Docs"
      title="Public API access is on the roadmap"
      description="We don't have a public API yet. If programmatic access would be useful for your business, let us know at hello@reputicious.com."
    />
  );
}
