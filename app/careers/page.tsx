import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { ComingSoonPage } from "@/components/simple/coming-soon";

export const metadata: Metadata = {
  title: "Careers — Reputicious",
  description: "No open roles right now, but check back as we grow.",
};

export default function CareersPage() {
  return (
    <ComingSoonPage
      icon={Briefcase}
      eyebrow="Careers"
      title="No open roles right now"
      description="We don't have any positions open at the moment, but we're growing. Check back here as we scale the team."
    />
  );
}
