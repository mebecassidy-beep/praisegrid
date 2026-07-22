"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Printer, QrCode } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Location } from "@/types";

type Target = "google" | "yelp" | "feedback";

const TARGET_OPTIONS: { value: Target; label: string; requires?: "google_place_id" | "yelp_business_id" }[] = [
  { value: "feedback", label: "Feedback Shield (private)" },
  { value: "google", label: "Google review", requires: "google_place_id" },
  { value: "yelp", label: "Yelp review", requires: "yelp_business_id" },
];

export function QrAssetHub({ locations }: { locations: Location[] }) {
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [target, setTarget] = useState<Target>("feedback");

  const location = locations.find((l) => l.id === locationId);
  const availableTargets = TARGET_OPTIONS.filter((opt) => !opt.requires || Boolean(location?.[opt.requires]));
  const imgSrc = locationId ? `/api/assets/qr?location_id=${locationId}&target=${target}` : "";

  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-blue-500" />
            QR &amp; table-tent hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
            Add a location first to generate printable QR codes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-blue-500" />
          QR &amp; table-tent hub
        </CardTitle>
        <CardDescription>
          Generate a print-ready QR code linking to your public review page or your private Feedback Shield.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            {locations.length > 1 && (
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            )}

            <div className="flex flex-col gap-1.5">
              {availableTargets.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTarget(opt.value)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-sm font-medium transition-colors",
                    target === opt.value
                      ? "border-blue-500 bg-blue-500/10 text-blue-600"
                      : "border-input text-muted-foreground hover:bg-accent"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <a href={`${imgSrc}&download=1`}>
                <Button size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Download PNG
                </Button>
              </a>
              <Link href={`/assets/table-tent?location_id=${locationId}&target=${target}`} target="_blank">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Printer className="h-3.5 w-3.5" />
                  Print table tent
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-lg border bg-muted/20 p-6">
            {imgSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgSrc} alt="QR code" className="h-40 w-40 rounded-md bg-white p-2 shadow-sm" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
