"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/lib/dashboard/mock-data";

interface LocationAiSettings {
  autoApprove5Star: boolean;
  autoApproveMinRating: number;
  toneInstructions: string;
  signOffName: string;
}

const DEFAULT_SETTINGS: Record<string, LocationAiSettings> = Object.fromEntries(
  LOCATIONS.map((loc) => [
    loc.id,
    {
      autoApprove5Star: true,
      autoApproveMinRating: 4,
      toneInstructions: "Friendly, concise, and never overly formal. Always thank the reviewer by name.",
      signOffName: `The ${loc.name.replace(" Location", "")} Team`,
    },
  ])
);

export function AiSettingsPanel() {
  const [activeLocationId, setActiveLocationId] = useState(LOCATIONS[0].id);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const current = settings[activeLocationId];

  function updateCurrent(patch: Partial<LocationAiSettings>) {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [activeLocationId]: { ...prev[activeLocationId], ...patch } }));
  }

  function handleSave() {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 600);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => {
              setActiveLocationId(loc.id);
              setSaved(false);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              activeLocationId === loc.id
                ? "border-blue-500 bg-blue-500/10 text-blue-600"
                : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {loc.name}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Brand voice
          </CardTitle>
          <CardDescription>
            Claude drafts every response using this tone guidance for{" "}
            {LOCATIONS.find((l) => l.id === activeLocationId)?.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tone">Tone instructions</Label>
            <Textarea
              id="tone"
              value={current.toneInstructions}
              onChange={(e) => updateCurrent({ toneInstructions: e.target.value })}
              placeholder="e.g. Friendly, concise, and never overly formal."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signoff">Sign-off name</Label>
            <Input
              id="signoff"
              value={current.signOffName}
              onChange={(e) => updateCurrent({ signOffName: e.target.value })}
              placeholder="e.g. The Downtown Team"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto-approve rules</CardTitle>
          <CardDescription>Automatically post AI drafts that meet your confidence bar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="auto-approve-5star">Auto-approve 5-star reviews</Label>
              <p className="text-xs text-muted-foreground">
                Post the AI draft immediately for perfect-rating reviews, no manual review needed.
              </p>
            </div>
            <Switch
              id="auto-approve-5star"
              checked={current.autoApprove5Star}
              onCheckedChange={(checked) => updateCurrent({ autoApprove5Star: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-rating">Minimum rating for auto-approval</Label>
            <div className="flex items-center gap-3">
              <input
                id="min-rating"
                type="range"
                min={1}
                max={5}
                step={1}
                value={current.autoApproveMinRating}
                onChange={(e) => updateCurrent({ autoApproveMinRating: Number(e.target.value) })}
                className="h-2 flex-1 cursor-pointer accent-blue-600"
              />
              <span className="w-16 shrink-0 text-sm font-medium tabular-nums">
                {current.autoApproveMinRating}★ and up
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Reviews below this rating are always routed to manual approval.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save AI settings"}
        </Button>
        {saved && !saving && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
            <Check className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
