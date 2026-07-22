"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Search, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const COMPETITOR_NAME_POOL = [
  "Summit", "Riverside", "Golden Gate", "Oakview", "Cedar Point", "Bayside", "Elm Street",
];

interface RankResult {
  category: string;
  zip: string;
  beforeRank: number;
  afterRank: number;
  competitors: { name: string; rating: number; reviewCount: number }[];
}

type Status = "idle" | "scanning" | "done";

export function MapRankSimulator() {
  const [category, setCategory] = useState("");
  const [zip, setZip] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RankResult | null>(null);

  function runSimulation(e: React.FormEvent) {
    e.preventDefault();
    if (status === "scanning" || !category.trim() || !zip.trim()) return;

    setStatus("scanning");

    const seed = hashString(`${category.trim().toLowerCase()}|${zip.trim()}`);
    const beforeRank = 4 + (seed % 6); // 4-9, outside the 3-pack
    const afterRank = 1 + (seed % 3); // 1-3, inside the 3-pack

    const competitors = Array.from({ length: 3 }).map((_, i) => ({
      name: `${COMPETITOR_NAME_POOL[(seed >> (i * 2)) % COMPETITOR_NAME_POOL.length]} ${category.trim() || "Business"}`,
      rating: Math.round((4.1 + (((seed >> (i * 3)) % 8) / 10)) * 10) / 10,
      reviewCount: 40 + ((seed >> (i * 4)) % 200),
    }));

    setTimeout(() => {
      setResult({ category: category.trim(), zip: zip.trim(), beforeRank, afterRank, competitors });
      setStatus("done");
    }, 1400);
  }

  return (
    <section className="bg-background py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-medium text-blue-600">
            <MapPin className="h-3.5 w-3.5" />
            Google Map ranking simulator
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Where do you rank in the local 3-pack?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter your category and zip code to simulate how review velocity affects your position
            in Google&apos;s local map results.
          </p>
        </div>

        <form
          onSubmit={runSimulation}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category, e.g. Plumber"
          />
          <Input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Zip code"
            className="sm:max-w-[140px]"
          />
          <Button type="submit" disabled={status === "scanning"} className="shrink-0 gap-2">
            {status === "scanning" ? (
              <TrendingUp className="h-4 w-4 animate-pulse" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Simulate ranking
          </Button>
        </form>
        <p className="mx-auto mt-2 max-w-lg text-center text-xs text-muted-foreground">
          Illustrative simulation — not a live Google Maps lookup.
        </p>

        <AnimatePresence mode="wait">
          {result && status === "done" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2"
            >
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-600">
                  Today — outside the 3-pack
                </p>
                <div className="space-y-2">
                  {result.competitors.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between rounded-lg bg-background/60 p-2.5 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
                          {i + 1}
                        </span>
                        {c.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {c.rating}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-[11px] font-semibold text-red-600">
                        {result.beforeRank}
                      </span>
                      Your business
                    </span>
                    <span className="text-xs text-red-600">Not visible in 3-pack</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  With Reputicious — inside the 3-pack
                </p>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => {
                    const isYou = i + 1 === result.afterRank;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center justify-between rounded-lg p-2.5 text-sm",
                          isYou
                            ? "border border-emerald-500/30 bg-emerald-500/10 font-medium"
                            : "bg-background/60"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                              isYou ? "bg-emerald-500/20 text-emerald-600" : "bg-muted"
                            )}
                          >
                            {i + 1}
                          </span>
                          {isYou ? "Your business" : result.competitors[i]?.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {isYou ? "4.9" : result.competitors[i]?.rating}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
