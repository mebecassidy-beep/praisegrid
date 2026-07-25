import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// Signs the OAuth `state` param so the callback route can trust locationId/
// userId without a server-side session store - a bare random nonce would
// need a DB round-trip to verify, this is stateless and tamper-proof instead.
export interface OAuthState {
  locationId: string;
  userId: string;
  nonce: string;
}

function getSecret(): string {
  const secret = process.env.OAUTH_STATE_SECRET;
  if (!secret) throw new Error("OAUTH_STATE_SECRET is not configured");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createOAuthState(locationId: string, userId: string): string {
  const state: OAuthState = { locationId, userId, nonce: randomBytes(9).toString("base64url") };
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyOAuthState(raw: string): OAuthState | null {
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}
