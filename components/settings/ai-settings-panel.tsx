"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TONE_PRESETS } from "@/lib/ai-settings/tone-presets";
import type { Location, TonePreset } from "@/types";

interface AiSettingsState {
  auto_approve_5star: boolean;
  auto_approve_min_rating: number;
  tone_instructions: string;
  tone_preset: TonePreset;
  sign_off_name: string;
}

const EMPTY_SETTINGS: AiSettingsState = {
  auto_approve_5star: false,
  auto_approve_min_rating: 5,
  tone_instructions: "",
  tone_preset: "custom",
  sign_off_name: "",
};

export function AiSettingsPanel({ locations }: { locations: Location[] }) {
  const [activeLocationId, setActiveLocationId] = useState(locations[0]?.id ?? "");
  const [settings, setSettings] = useState<AiSettingsState>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeLocationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setSaved(false);
    fetch(`/api/settings/ai?location_id=${encodeURIComponent(activeLocationId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings({
            auto_approve_5star: data.settings.auto_approve_5star ?? false,
            auto_approve_min_rating: data.settings.auto_approve_min_rating ?? 5,
            tone_instructions: data.settings.tone_instructions ?? "",
            tone_preset: data.settings.tone_preset ?? "custom",
            sign_off_name: data.settings.sign_off_name ?? "",
          });
        }
      })
      .catch(() => setError("Couldn't load settings for this location."))
      .finally(() => setLoading(false));
  }, [activeLocationId]);

  function updateCurrent(patch: Partial<AiSettingsState>) {
    setSaved(false);
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function applyPreset(preset: Exclude<TonePreset, "custom">) {
    updateCurrent({ tone_preset: preset, tone_instructions: TONE_PRESETS[preset].instructions });
  }

  async function handleSave() {
    if (!activeLocationId || saving) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/settings/ai", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location_id: activeLocationId, ...settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't save AI settings.");
      setSaved(true);
    } catch (err: any) {
      setError(err.message || "Couldn't save AI settings.");
    } finally {
      setSaving(false);
    }
  }

  if (locations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-sm text-muted-foreground">
        Connect a location first to configure its brand voice.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setActiveLocationId(loc.id)}
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
            Brand voice persona
          </CardTitle>
          <CardDescription>
            Quick-toggle a preset tuned for how local customers expect to hear from{" "}
            {locations.find((l) => l.id === activeLocationId)?.name}, or write your own.
          </CardDescription>
        </CardHeader>
        <CardContent className={cn("space-y-4 transition-opacity", loading && "opacity-50")}>
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(TONE_PRESETS) as Array<keyof typeof TONE_PRESETS>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors",
                  settings.tone_preset === key
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-input hover:bg-accent"
                )}
              >
                <p className="text-sm font-semibold">{TONE_PRESETS[key].label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{TONE_PRESETS[key].description}</p>
              </button>
            ))}
            <button
              type="button"
              onClick={() => updateCurrent({ tone_preset: "custom" })}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors",
                settings.tone_preset === "custom"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-input hover:bg-accent"
              )}
            >
              <p className="text-sm font-semibold">Custom</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Write your own tone instructions below.</p>
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tone">Tone instructions</Label>
            <Textarea
              id="tone"
              value={settings.tone_instructions}
              onChange={(e) => updateCurrent({ tone_preset: "custom", tone_instructions: e.target.value })}
              placeholder="e.g. Friendly, concise, and never overly formal."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signoff">Sign-off name</Label>
            <Input
              id="signoff"
              value={settings.sign_off_name}
              onChange={(e) => updateCurrent({ sign_off_name: e.target.value })}
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
              checked={settings.auto_approve_5star}
              onCheckedChange={(checked) => updateCurrent({ auto_approve_5star: checked })}
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
                value={settings.auto_approve_min_rating}
                onChange={(e) => updateCurrent({ auto_approve_min_rating: Number(e.target.value) })}
                className="h-2 flex-1 cursor-pointer accent-blue-600"
              />
              <span className="w-16 shrink-0 text-sm font-medium tabular-nums">
                {settings.auto_approve_min_rating}★ and up
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Reviews below this rating are always routed to manual approval — Crisis Mode reviews always stay
              manual regardless of this setting.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save AI settings"}
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
