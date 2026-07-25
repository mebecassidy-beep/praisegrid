import { NextResponse } from "next/server";

// Temporary diagnostic to pinpoint why isGbpOAuthConfigured() is returning
// false in production. Reports only presence/length/first+last char, never
// the raw secret value. Delete after use.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const describe = (name: string) => {
    const value = process.env[name];
    return {
      isSet: typeof value === "string" && value.length > 0,
      length: value?.length ?? 0,
      firstChar: value?.[0] ?? null,
      lastChar: value?.[value.length - 1] ?? null,
    };
  };

  return NextResponse.json({
    GOOGLE_OAUTH_CLIENT_ID: describe("GOOGLE_OAUTH_CLIENT_ID"),
    GOOGLE_OAUTH_CLIENT_SECRET: describe("GOOGLE_OAUTH_CLIENT_SECRET"),
    OAUTH_STATE_SECRET: describe("OAUTH_STATE_SECRET"),
  });
}
