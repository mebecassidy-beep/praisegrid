"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, ShieldCheck } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GooglePlaceSearch, type PlaceSuggestion } from "@/components/dashboard/google-place-search";

export function AddLocationModal({
  open,
  onClose,
  googlePlacesEnabled,
}: {
  open: boolean;
  onClose: () => void;
  googlePlacesEnabled: boolean;
}) {
  const router = useRouter();
  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [selected, setSelected] = useState<{ name: string; address: string; placeId: string } | null>(null);

  async function handleSelect(suggestion: PlaceSuggestion) {
    setResolving(true);
    setError(null);
    try {
      const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(suggestion.placeId)}`);
      const data = await res.json();
      if (!res.ok || !data.details) throw new Error("Couldn't load details for that business.");
      setSelected({
        name: data.details.name,
        address: data.details.formattedAddress,
        placeId: suggestion.placeId,
      });
    } catch (err: any) {
      setError(err.message || "Couldn't load details for that business.");
    } finally {
      setResolving(false);
    }
  }

  async function handleConnect() {
    setSaving(true);
    setError(null);
    try {
      const payload = selected
        ? { name: selected.name, address: selected.address, google_place_id: selected.placeId }
        : { name: manualName.trim(), address: manualAddress.trim() || null };

      if (!payload.name) {
        setError("A business name is required.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't connect this location.");

      setSelected(null);
      setManualName("");
      setManualAddress("");
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Couldn't connect this location.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex h-full flex-col p-6">
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
          <MapPin className="h-5 w-5 text-white" />
        </span>
        <h2 className="text-xl font-bold tracking-tight">Connect your business</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {googlePlacesEnabled
            ? "Search for your business on Google to connect it in seconds."
            : "Add your business details, you can connect live Google data any time."}
        </p>

        <div className="mt-6 space-y-4">
          {googlePlacesEnabled ? (
            <>
              <GooglePlaceSearch onSelect={handleSelect} disabled={resolving || saving} />
              {resolving && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading business details…
                </p>
              )}
              {selected && (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm font-semibold">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">{selected.address}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="loc-name">Business name</Label>
                <Input
                  id="loc-name"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Brightleaf Cafe"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loc-address">Address (optional)</Label>
                <Input
                  id="loc-address"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="123 Main St, Your City"
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-auto space-y-3 pt-6">
          <Button
            onClick={handleConnect}
            disabled={saving || (googlePlacesEnabled ? !selected : !manualName.trim())}
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Connect business
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            100% compliant with Google &amp; Meta platform guidelines
          </p>
        </div>
      </div>
    </Sheet>
  );
}
