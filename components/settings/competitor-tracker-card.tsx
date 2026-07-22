"use client";

import { useState } from "react";
import { Check, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CompetitorTrackerCard({ initialCompetitorName }: { initialCompetitorName: string | null }) {
  const [competitorName, setCompetitorName] = useState(initialCompetitorName ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/competitor", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitor_name: competitorName }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          Competitor tracking
        </CardTitle>
        <CardDescription>
          Get a weekly email comparing your rating against a local competitor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="competitor-name">Competitor business name</Label>
          <Input
            id="competitor-name"
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
            placeholder="e.g. Downtown Plumbing Co."
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          {saved && !saving && (
            <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          We pull a live Google rating for this business when we can find a public listing — otherwise
          your report shows a benchmark estimate instead.
        </p>
      </CardContent>
    </Card>
  );
}
