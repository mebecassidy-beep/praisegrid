import type { Metadata } from "next";
import { BusinessScanLanding } from "@/components/landing/business-scan-landing";

export const metadata: Metadata = {
  title: "Free Reputation Scan — See Your Real Review Score | Reputicious",
  description:
    "Enter your business and get an instant Reputation Score, see how many customers unanswered reviews are costing you, and claim 50% off your first month.",
};

export default function ScanPage() {
  return <BusinessScanLanding />;
}
