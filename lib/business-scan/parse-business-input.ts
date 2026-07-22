/**
 * Accepts either a plain business name or a pasted URL (e.g. a Google
 * Business Profile link) from the Claim Your Business input. This is a
 * display-layer parse only — it extracts a readable label to search Google
 * Places with; getBusinessScan() does the actual real-data lookup.
 */
export function parseBusinessInput(raw: string): { label: string; wasUrl: boolean } {
  const trimmed = raw.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    return { label: trimmed, wasUrl: false };
  }

  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    const raw2 = lastSegment ? decodeURIComponent(lastSegment) : url.hostname.replace(/^www\./, "");
    const label = raw2
      .replace(/[-_+]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return { label: label || url.hostname, wasUrl: true };
  } catch {
    return { label: trimmed, wasUrl: false };
  }
}
