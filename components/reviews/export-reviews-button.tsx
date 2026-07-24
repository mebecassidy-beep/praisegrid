"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewsToCsv } from "@/lib/csv/reviews-to-csv";
import type { Review } from "@/types";

export function ExportReviewsButton({ reviews }: { reviews: Review[] }) {
  function handleExport() {
    const csv = reviewsToCsv(reviews);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button size="sm" variant="outline" onClick={handleExport} disabled={reviews.length === 0} className="gap-1.5">
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </Button>
  );
}
