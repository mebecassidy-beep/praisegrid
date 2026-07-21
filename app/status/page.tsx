import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { ComingSoonPage } from "@/components/simple/coming-soon";

export const metadata: Metadata = {
  title: "System Status — Reputicious",
  description: "Real-time status monitoring for Reputicious is coming soon.",
};

export default function StatusPage() {
  return (
    <ComingSoonPage
      icon={Activity}
      eyebrow="System Status"
      title="A public status page is on the way"
      description="We're setting up real-time status monitoring. In the meantime, if something seems off, reach out at support@reputicious.com and we'll look into it right away."
    />
  );
}
