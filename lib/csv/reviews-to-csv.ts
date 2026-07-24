import type { Review } from "@/types";

const HEADERS = ["Date", "Platform", "Reviewer", "Rating", "Status", "Review", "Response"];

function escapeCsvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function reviewsToCsv(reviews: Review[]): string {
  const rows = reviews.map((r) => [
    r.review_date ? new Date(r.review_date).toISOString().slice(0, 10) : "",
    r.platform,
    r.reviewer_name ?? "",
    String(r.rating),
    r.status,
    r.review_text ?? "",
    r.response_text ?? "",
  ]);
  return [HEADERS, ...rows].map((row) => row.map(escapeCsvField).join(",")).join("\n");
}
