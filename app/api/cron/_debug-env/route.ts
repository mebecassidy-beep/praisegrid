import { NextResponse } from "next/server";

// Temporary diagnostic only - never returns the actual secret value, just
// whether it's set and how long it is, to debug a persistent CRON_SECRET
// mismatch without guessing at values back and forth. Delete after use.
export async function GET() {
  const value = process.env.CRON_SECRET;
  return NextResponse.json({
    isSet: typeof value === "string" && value.length > 0,
    length: value?.length ?? 0,
    firstChar: value ? value[0] : null,
    lastChar: value ? value[value.length - 1] : null,
  });
}
