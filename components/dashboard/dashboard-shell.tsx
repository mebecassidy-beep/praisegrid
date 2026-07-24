"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { RealtimeReviewListener } from "@/components/dashboard/realtime-review-listener";
import type { Location, Review, SubscriptionTier } from "@/types";

const THEME_KEY = "praisegrid-theme";
type Theme = "light" | "dark";

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
  const [theme, setTheme] = useState<Theme>("light");

  // Read after mount (not in useState's initializer) since localStorage/
  // matchMedia aren't available during SSR, this trades a brief light-mode
  // flash on first paint for avoiding a hydration mismatch.
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const preferred: Theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(preferred);
  }, []);

  // Toggled on <html> (not this component's own wrapper) so translucent
  // utilities like bg-muted/30 correctly blend against a dark <body> instead
  // of the light one they'd see if only a child div carried the "dark"
  // class. Removed on unmount so leaving the dashboard for a marketing page
  // (never audited for dark mode) always renders light, regardless of what
  // the user chose in here.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <RealtimeReviewListener locationIds={locations.map((l) => l.id)} />
      <Sidebar tier={tier} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userEmail={userEmail}
          locations={locations}
          reviews={reviews}
          onMenuClick={() => setMobileNavOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
