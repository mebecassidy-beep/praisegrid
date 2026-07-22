"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReportFrequency } from "@/types";

const PREFERENCES = [
  {
    key: "newReview",
    label: "New review alerts",
    description: "Get notified as soon as a new review comes in on any platform.",
    defaultChecked: true,
  },
  {
    key: "flaggedReview",
    label: "Flagged review alerts",
    description: "Immediate alert when a review is flagged for manual attention.",
    defaultChecked: true,
  },
  {
    key: "autoApproveDigest",
    label: "Auto-approve activity digest",
    description: "Daily summary of responses posted automatically by your AI rules.",
    defaultChecked: false,
  },
];

const FREQUENCY_OPTIONS: { value: ReportFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "off", label: "Off" },
];

export function NotificationPreferencesCard({
  initialReportFrequency,
}: {
  initialReportFrequency: ReportFrequency;
}) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(PREFERENCES.map((p) => [p.key, p.defaultChecked]))
  );
  const [reportFrequency, setReportFrequency] = useState<ReportFrequency>(initialReportFrequency);
  const [saving, setSaving] = useState(false);

  async function handleFrequencyChange(value: ReportFrequency) {
    const previous = reportFrequency;
    setReportFrequency(value);
    setSaving(true);

    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_frequency: value }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setReportFrequency(previous);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification preferences</CardTitle>
        <CardDescription>Choose what you want to be notified about, and how often.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {PREFERENCES.map((pref) => (
          <div key={pref.key} className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor={pref.key}>{pref.label}</Label>
              <p className="text-xs text-muted-foreground">{pref.description}</p>
            </div>
            <Switch
              id={pref.key}
              checked={state[pref.key]}
              onCheckedChange={(checked) => setState((prev) => ({ ...prev, [pref.key]: checked }))}
            />
          </div>
        ))}

        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>Reputation Impact summary email</Label>
            <p className="text-xs text-muted-foreground">
              A recap of your health score, ratings, and response rate, delivered on a schedule.
            </p>
          </div>
          <div className="flex shrink-0 gap-1 rounded-lg border p-1">
            {FREQUENCY_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant="ghost"
                disabled={saving}
                onClick={() => handleFrequencyChange(option.value)}
                className={cn(
                  "h-7 px-2.5 text-xs",
                  reportFrequency === option.value && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
