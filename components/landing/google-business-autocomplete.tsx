"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface PlaceSuggestion {
  placeId: string;
  description: string;
}

export function GoogleBusinessAutocomplete({
  onSelect,
  disabled,
}: {
  onSelect: (suggestion: PlaceSuggestion) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={query}
          disabled={disabled}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Start typing your business name…"
          className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-500" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl">
          {suggestions.map((s) => (
            <button
              key={s.placeId}
              type="button"
              onClick={() => {
                setQuery(s.description);
                setOpen(false);
                setSuggestions([]);
                onSelect(s);
              }}
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/5"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span className="truncate">{s.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
