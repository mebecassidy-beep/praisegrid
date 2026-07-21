"use client";

import { useState } from "react";
import { Bell, Check, ChevronDown, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/lib/dashboard/mock-data";

const NOTIFICATIONS = [
  { id: "n1", text: "New 2★ review flagged on Yelp for Riverside Location", time: "12m ago" },
  { id: "n2", text: "AI drafted 4 new responses awaiting approval", time: "1h ago" },
  { id: "n3", text: "Weekly sentiment report is ready", time: "3h ago" },
];

function closeOnBlur(setOpen: (v: boolean) => void) {
  return (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
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
        <div className="relative" onBlur={closeOnBlur(setLocationOpen)}>
          <button
            onClick={() => setLocationOpen((v) => !v)}
            className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm hover:bg-accent"
          >
            <span className="hidden sm:inline">{location.name}</span>
            <span className="sm:hidden">Location</span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", locationOpen && "rotate-180")} />
          </button>
          {locationOpen && (
            <div className="absolute right-0 z-40 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setLocation(loc);
                    setLocationOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  {loc.name}
                  {loc.id === location.id && <Check className="h-4 w-4 text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" onBlur={closeOnBlur(setNotifOpen)}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {NOTIFICATIONS.length}
            </span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 z-40 mt-2 w-72 rounded-md border bg-popover p-1 shadow-md">
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Notifications</p>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="rounded-sm px-2 py-2 text-sm hover:bg-accent">
                  <p className="text-foreground">{n.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" onBlur={closeOnBlur(setProfileOpen)}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-semibold text-white"
          >
            AR
          </button>
          {profileOpen && (
            <div className="absolute right-0 z-40 mt-2 w-48 rounded-md border bg-popover p-1 shadow-md">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">Alex Rivera</p>
                <p className="text-xs text-muted-foreground">alex@brightleafcafe.com</p>
              </div>
              <div className="my-1 h-px bg-border" />
              <button className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent">
                Account settings
              </button>
              <button className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-red-500 hover:bg-accent">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
