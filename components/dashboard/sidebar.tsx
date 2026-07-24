"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageSquareText,
  QrCode,
  Settings,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UpgradeSlideOver } from "@/components/dashboard/upgrade-slide-over";
import { hasProAccess } from "@/lib/subscription";
import type { SubscriptionTier } from "@/types";

const TIER_LABEL: Record<SubscriptionTier, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

function TierBadge({ tier }: { tier: SubscriptionTier }) {
  if (tier === "pro") {
    return (
      <Badge className="border-transparent bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow">
        Pro
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-slate-700 text-slate-300">
      {TIER_LABEL[tier]}
    </Badge>
  );
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reviews", label: "Reviews", icon: MessageSquareText },
  { href: "/settings/ai", label: "AI Settings", icon: Sparkles },
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/franchise", label: "Franchise View", icon: Building2, requiresPro: true },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/marketing", label: "Social Auto-Pilot", icon: Sparkles },
  { href: "/assets", label: "QR & Table Tents", icon: QrCode },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLinks({
  tier,
  onNavigate,
  onLockedClick,
}: {
  tier: SubscriptionTier;
  onNavigate?: () => void;
  onLockedClick: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const locked = item.requiresPro && !hasProAccess(tier);

        if (locked) {
          return (
            <button
              key={item.href}
              onClick={onLockedClick}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-800/60 hover:text-slate-300"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <Lock className="h-3.5 w-3.5 shrink-0" />
            </button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({
  tier,
  open,
  onClose,
}: {
  tier: SubscriptionTier;
  open: boolean;
  onClose: () => void;
}) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 py-6 md:flex">
        <div className="mb-8 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
              <Star className="h-4 w-4 fill-white text-white" />
            </span>
            Praisegrid
          </Link>
          <TierBadge tier={tier} />
        </div>
        <NavLinks tier={tier} onLockedClick={() => setUpgradeOpen(true)} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-slate-800 bg-slate-950 py-6">
            <div className="mb-8 flex items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
                  <Star className="h-4 w-4 fill-white text-white" />
                </span>
                Praisegrid
              </Link>
              <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 px-4">
              <TierBadge tier={tier} />
            </div>
            <NavLinks tier={tier} onNavigate={onClose} onLockedClick={() => setUpgradeOpen(true)} />
          </aside>
        </div>
      )}

      <UpgradeSlideOver
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        featureName="Multi-Location Analytics"
        tier="pro"
      />
    </>
  );
}
