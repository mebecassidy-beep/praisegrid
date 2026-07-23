"use client";

import { useState } from "react";
import { MapPin, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddLocationModal } from "@/components/dashboard/add-location-modal";

export function OnboardingBanner({ googlePlacesEnabled }: { googlePlacesEnabled: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  if (dismissed) return null;

  async function handleDismiss() {
    setDismissing(true);
    try {
      await fetch("/api/onboarding/complete", { method: "POST" });
    } finally {
      setDismissed(true);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-4 py-3.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold">Welcome to Praisegrid!</p>
            <p className="text-xs text-muted-foreground">
              Connect your Google Business Profile to start seeing real reviews and AI-drafted responses.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Connect Google Business Profile
          </Button>
          <button
            onClick={handleDismiss}
            disabled={dismissing}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AddLocationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        googlePlacesEnabled={googlePlacesEnabled}
      />
    </>
  );
}
