// In-memory fixed-window rate limiter for public, unauthenticated API routes.
// Resets on cold start and isn't shared across serverless instances — good enough
// as a basic abuse guard, not a hard security boundary. Upgrade to Upstash Redis
// (Vercel Marketplace) if this needs to hold up under real abuse.

const windows = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || now >= entry.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}
