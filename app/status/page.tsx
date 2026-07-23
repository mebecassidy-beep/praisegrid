import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { ComingSoonPage } from "@/components/simple/coming-soon";

export const metadata: Metadata = pageMetadata({
  title: "System Status | Praisegrid",
  description: "Real-time status monitoring for Praisegrid is coming soon.",
  path: "/status",
});

export default function StatusPage() {
  return (
    <ComingSoonPage
      icon={Activity}
      eyebrow="System Status"
      title="A public status page is on the way"
      description="We're setting up real-time status monitoring. In the meantime, if something seems off, reach out at support@praisegrid.com and we'll look into it right away."
    />
  );
}
