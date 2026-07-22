"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, ChevronDown, Loader2, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { crisisRank, getDisplayStatus } from "@/lib/reviews/display-status";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { Location, Review } from "@/types";

function closeOnBlur(setOpen: (v: boolean) => void) {
  return (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };
}

function relativeTime(dateStr: string | null) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function Topbar({
  userEmail,
  locations,
  reviews,
  onMenuClick,
}: {
  userEmail: string;
  locations: Location[];
  reviews: Review[];
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [locationId, setLocationId] = useState(locations[0]?.id ?? null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "?";

  const selectedLocation = locations.find((l) => l.id === locationId) ?? null;

  // Real notifications derived from actual flagged/high-risk reviews — no
  // fabricated activity. Every reviewer, platform, and timestamp shown here
  // is a genuine review in the account.
  const flaggedReviews = reviews
    .filter((r) => getDisplayStatus(r) === "flagged")
    .sort((a, b) => crisisRank(a) - crisisRank(b))
    .slice(0, 5);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 transform-gpu items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="text-muted-foreground hover:text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search reviews, reviewers…"
          className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {locations.length > 0 ? (
          <div className="relative" onBlur={closeOnBlur(setLocationOpen)}>
            <button
              onClick={() => setLocationOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm hover:bg-accent"
            >
              <span className="hidden sm:inline">{selectedLocation?.name ?? "Select location"}</span>
              <span className="sm:hidden">Location</span>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", locationOpen && "rotate-180")} />
            </button>
            {locationOpen && (
              <div className="absolute right-0 z-40 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setLocationId(loc.id);
                      setLocationOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    {loc.name}
                    {loc.id === locationId && <Check className="h-4 w-4 text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className="hidden h-9 items-center rounded-md border border-dashed px-3 text-sm text-muted-foreground sm:flex">
            No location yet
          </span>
        )}

        <div className="relative" onBlur={closeOnBlur(setNotifOpen)}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {flaggedReviews.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {flaggedReviews.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 z-40 mt-2 w-72 rounded-md border bg-popover p-1 shadow-md">
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Notifications</p>
              {flaggedReviews.length === 0 ? (
                <p className="px-2 py-3 text-sm text-muted-foreground">No new notifications.</p>
              ) : (
                flaggedReviews.map((r) => (
                  <div key={r.id} className="rounded-sm px-2 py-2 text-sm hover:bg-accent">
                    <p className="text-foreground">
                      {r.risk_level === "high" ? "Crisis Alert: " : "Flagged: "}
                      {r.rating}★ review on {PLATFORM_META[r.platform].label}
                      {r.reviewer_name ? ` from ${r.reviewer_name}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{relativeTime(r.review_date)}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="relative" onBlur={closeOnBlur(setProfileOpen)}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-semibold text-white"
          >
            {initials}
          </button>
          {profileOpen && (
            <div className="absolute right-0 z-40 mt-2 w-48 rounded-md border bg-popover p-1 shadow-md">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-medium text-foreground">{userEmail}</p>
              </div>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/settings");
                }}
                className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                Account settings
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm text-red-500 hover:bg-accent"
              >
                {loggingOut && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
