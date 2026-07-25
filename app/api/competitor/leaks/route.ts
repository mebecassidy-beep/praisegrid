import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getCompetitorLeaks } from "@/lib/competitor/get-competitor-leaks";
import { checkRateLimit } from "@/lib/rate-limit";
import { getEffectiveAccountId } from "@/lib/team/account";

// On-demand (not run on every page load) since it can make a Claude call —
// the analytics card triggers this from a button rather than the page
// fetching it automatically on every visit.
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(`competitor-leaks:${user.id}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("competitor_name")
      .eq("id", accountId)
      .single();

    if (!profile?.competitor_name) {
      return NextResponse.json({ error: "Add a competitor in Settings first." }, { status: 400 });
    }

    const result = await getCompetitorLeaks(profile.competitor_name);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error finding competitor leaks:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
