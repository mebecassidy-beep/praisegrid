"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import type { Location, Review, SubscriptionTier } from "@/types";

export function DashboardShell({
  tier,
  userEmail,
  locations,
  reviews,
  children,
}: {
  tier: SubscriptionTier;
  userEmail: string;
  locations: Location[];
  reviews: Review[];
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar tier={tier} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userEmail={userEmail}
          locations={locations}
          reviews={reviews}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
