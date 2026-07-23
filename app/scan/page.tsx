import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BusinessScanLanding } from "@/components/landing/business-scan-landing";

export const metadata: Metadata = pageMetadata({
  title: "Free Reputation Scan | See Your Real Review Score | Praisegrid",
  description:
    "Enter your business and get an instant Reputation Score, see how many customers unanswered reviews are costing you, and claim 50% off your first month.",
  path: "/scan",
});

export default function ScanPage() {
  return <BusinessScanLanding />;
}
