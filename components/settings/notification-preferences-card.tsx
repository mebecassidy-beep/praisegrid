"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
    key: "weeklyDigest",
    label: "Weekly summary email",
    description: "A weekly recap of review volume, ratings, and sentiment trends.",
    defaultChecked: true,
  },
  {
    key: "autoApproveDigest",
    label: "Auto-approve activity digest",
    description: "Daily summary of responses posted automatically by your AI rules.",
    defaultChecked: false,
  },
];

export function NotificationPreferencesCard() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(PREFERENCES.map((p) => [p.key, p.defaultChecked]))
  );

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
      </CardContent>
    </Card>
  );
}
