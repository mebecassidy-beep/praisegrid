import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { ComingSoonPage } from "@/components/simple/coming-soon";

export const metadata: Metadata = {
  title: "Blog | Praisegrid",
  description: "Insights on review management and local business growth, coming soon.",
};

export default function BlogPage() {
  return (
    <ComingSoonPage
      icon={Newspaper}
      eyebrow="Blog"
      title="We're just getting started on this one"
      description="We're working on articles about review management, local SEO, and getting the most out of AI-drafted responses. Check back soon."
    />
  );
}
