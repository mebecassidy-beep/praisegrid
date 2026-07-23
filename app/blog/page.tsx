import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { ComingSoonPage } from "@/components/simple/coming-soon";

export const metadata: Metadata = pageMetadata({
  title: "Blog | Praisegrid",
  description: "Insights on review management and local business growth, coming soon.",
  path: "/blog",
});

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
