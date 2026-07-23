// One-off seed script for marketing feature-page screenshots.
// Creates an isolated demo account (own user_id, own location, own reviews)
// via the Supabase service-role client — RLS scopes everything to this user,
// so it never touches real customer data. Safe to re-run: deletes and
// recreates the demo user's rows each time.
//
// Usage: node scripts/seed-demo-screenshots.mjs

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.resolve(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) process.env[match[1]] ||= match[2];
}

const DEMO_EMAIL = "demo-screenshots@praisegrid.com";
const DEMO_PASSWORD = "ScreenshotDemo2026!";
const COMPETITOR_NAME = "Riverside Table";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function daysAgo(n) {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

// A review posted `reviewDaysAgo` days ago, responded to `hoursLater` hours
// after that — used to give the Reputation Revenue Forensics feature real,
// varied response-time data to compute from.
function respondedAt(reviewDaysAgo, hoursLater) {
  return new Date(Date.now() - reviewDaysAgo * 86_400_000 + hoursLater * 3_600_000).toISOString();
}

async function main() {
  // 1. Find or create the demo auth user.
  let userId;
  const { data: existingUsers } = await supabase.auth.admin.listUsers({ perPage: 200 });
  const existing = existingUsers?.users.find((u) => u.email === DEMO_EMAIL);

  if (existing) {
    userId = existing.id;
    console.log(`Reusing existing demo user ${userId}`);
  } else {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    userId = created.user.id;
    console.log(`Created demo user ${userId}`);
  }

  // 2. Wipe any previously-seeded data for this user so reruns are clean.
  const { data: oldLocations } = await supabase
    .from("locations")
    .select("id")
    .eq("user_id", userId);
  const oldLocationIds = (oldLocations ?? []).map((l) => l.id);
  if (oldLocationIds.length > 0) {
    await supabase.from("reviews").delete().in("location_id", oldLocationIds);
    await supabase.from("ai_settings").delete().in("location_id", oldLocationIds);
    await supabase.from("locations").delete().in("id", oldLocationIds);
  }

  // 3. Profile: company + competitor name, onboarding already complete so
  // the onboarding banner doesn't crowd the screenshots. estimated_customer_value
  // is this demo business's own (illustrative) answer to the Settings ->
  // Reputation Revenue Forensics prompt — a mid-range assumption for a
  // bistro with repeat guests, editable via components/settings/revenue-estimate-card.tsx.
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      company_name: "Maple & Main Bistro",
      competitor_name: COMPETITOR_NAME,
      subscription_tier: "pro",
      onboarding_completed_at: new Date().toISOString(),
      estimated_customer_value: 275,
    })
    .eq("id", userId);
  if (profileError) throw profileError;

  // 4. Location.
  const { data: location, error: locationError } = await supabase
    .from("locations")
    .insert({
      user_id: userId,
      name: "Maple & Main Bistro",
      address: "214 Maple Ave, Portland, OR",
    })
    .select()
    .single();
  if (locationError) throw locationError;
  console.log(`Created location ${location.id}`);

  // 5. AI brand-voice settings — friendly neighborhood tone, so generated
  // responses have a distinct, screenshot-worthy voice.
  const { error: aiSettingsError } = await supabase.from("ai_settings").insert({
    location_id: location.id,
    tone_preset: "friendly_neighborhood",
    tone_instructions:
      "Warm, casual, and personal — like a neighbor, not a corporation. Use the reviewer's first name, contractions, and the occasional exclamation point. Mention local touches (the block, the team by first name) when it fits naturally. Never sound scripted or corporate.",
    sign_off_name: "The Maple & Main Team",
    auto_approve_5star: false,
    auto_approve_min_rating: 5,
  });
  if (aiSettingsError) throw aiSettingsError;

  // 6. Reviews. The first one is the crisis review: 1-star + a high-risk
  // keyword ("food poisoning", "lawyer") so lib/reviews/classify-risk.ts
  // marks it risk_level "high" and it pins to the top of the feed with the
  // Crisis Alert badge. response_text is left null on purpose for the
  // crisis review and one other review — those get a real Claude Opus draft
  // generated live in the browser for the screenshots, instead of
  // hand-written placeholder text.
  //
  // Reviews with status "posted" + responded_at set are what
  // lib/analytics/revenue-forensics.ts counts as "rescued" once they're also
  // rating <= 2. A few are backdated into earlier months (via daysAgo well
  // past 30/60) purely to give the recovery-volume trend chart more than one
  // data point — the counts, dates, and computed response times are all
  // real, just deliberately spread out for a representative demo.
  const reviews = [
    {
      platform: "google",
      reviewer_name: "Jordan T.",
      rating: 1,
      review_text:
        "I got food poisoning after eating here last night and ended up in the ER. Completely unacceptable, my lawyer will be hearing about this.",
      review_date: daysAgo(0),
      status: "pending",
      risk_level: "high",
      flagged_at: new Date().toISOString(),
      response_text: null,
      responded_at: null,
    },
    {
      platform: "google",
      reviewer_name: "Casey M.",
      rating: 4,
      review_text:
        "Loved the pasta and the patio seating, but our table waited almost 20 minutes just to get menus on a Friday night. Please fix the wait situation!",
      review_date: daysAgo(2),
      status: "pending",
      risk_level: null,
      response_text: null,
      responded_at: null,
    },
    {
      platform: "yelp",
      reviewer_name: "Priya S.",
      rating: 5,
      review_text: "Best brunch in the neighborhood, the mimosas and the staff are both incredible!",
      review_date: daysAgo(5),
      status: "posted",
      risk_level: null,
      response_text:
        "Priya, this made our whole week! We'll pass it along to the brunch crew. See you again soon, the mimosas will be waiting. — The Maple & Main Team",
      responded_at: respondedAt(5, 3),
    },
    {
      platform: "facebook",
      reviewer_name: null,
      rating: 2,
      review_text: "Service was slow and our order came out wrong twice.",
      review_date: daysAgo(1),
      status: "posted",
      risk_level: "medium",
      flagged_at: daysAgo(1),
      response_text:
        "We're sorry the timing and the order mix-up got in the way of your visit, that's on us. We'd like to make it right, please reach out directly so we can talk it through. — The Maple & Main Team",
      responded_at: respondedAt(1, 6),
    },
    {
      platform: "google",
      reviewer_name: "Marcus L.",
      rating: 5,
      review_text: "Date night perfection, will be back every month.",
      review_date: daysAgo(6),
      status: "posted",
      risk_level: null,
      response_text:
        "Marcus, thank you for making us part of date night! We'll see you and yours next month. — The Maple & Main Team",
      responded_at: respondedAt(6, 20),
    },
    {
      platform: "yelp",
      reviewer_name: "Dana R.",
      rating: 3,
      review_text: "Food was good but pretty pricey for the portion size.",
      review_date: daysAgo(3),
      status: "pending",
      risk_level: null,
      response_text: null,
      responded_at: null,
    },
    {
      platform: "yelp",
      reviewer_name: null,
      rating: 1,
      review_text: "Waited 40 minutes and the manager was rude when we asked for an update.",
      review_date: daysAgo(4),
      status: "posted",
      risk_level: "medium",
      flagged_at: daysAgo(4),
      response_text:
        "We're sorry about the wait and how that conversation with our manager went, that's not how we want anyone to feel here. We'd like to make this right, please reach out directly so we can. — The Maple & Main Team",
      responded_at: respondedAt(4, 8),
    },
    {
      platform: "facebook",
      reviewer_name: "Whitney K.",
      rating: 5,
      review_text: "Their new seasonal menu is incredible, the risotto is a must-try.",
      review_date: daysAgo(8),
      status: "posted",
      risk_level: null,
      response_text:
        "Whitney, so glad the seasonal menu is landing, the risotto is one of our favorites too! Thanks for shouting it out. — The Maple & Main Team",
      responded_at: respondedAt(8, 30),
    },
    {
      platform: "google",
      reviewer_name: "Sam O.",
      rating: 4,
      review_text: "Great vibe and friendly staff, only note is the parking lot is tiny.",
      review_date: daysAgo(10),
      status: "posted",
      risk_level: null,
      response_text:
        "Sam, thanks for the kind words! Parking is tight, we know, street parking on Main tends to open up fastest. See you next time. — The Maple & Main Team",
      responded_at: respondedAt(10, 22),
    },
    {
      platform: "google",
      reviewer_name: null,
      rating: 2,
      review_text: "Ordered delivery and it arrived cold.",
      review_date: daysAgo(12),
      status: "posted",
      risk_level: "medium",
      flagged_at: daysAgo(12),
      response_text:
        "Cold delivery isn't the experience we want, we're sorry. We'd like to send this to our kitchen lead and make sure it's addressed, please reach out directly with your order details. — The Maple & Main Team",
      responded_at: respondedAt(12, 26),
    },
    {
      platform: "google",
      reviewer_name: "Taylor B.",
      rating: 1,
      review_text: "The wait was over an hour and no one apologized for it.",
      review_date: daysAgo(40),
      status: "posted",
      risk_level: "medium",
      flagged_at: daysAgo(40),
      response_text:
        "An hour is way too long, and you deserved an apology in the moment, we're sorry you didn't get one. We're working on pacing during peak hours. Please reach out directly, we'd like to make this right. — The Maple & Main Team",
      responded_at: respondedAt(40, 27),
    },
    {
      platform: "yelp",
      reviewer_name: "Morgan P.",
      rating: 2,
      review_text: "Kitchen got my order wrong and the fix took forever.",
      review_date: daysAgo(70),
      status: "posted",
      risk_level: "medium",
      flagged_at: daysAgo(70),
      response_text:
        "Getting the order wrong is on us, and the fix should've been faster, we're sorry on both counts. We'd like to hear more, please reach out directly. — The Maple & Main Team",
      responded_at: respondedAt(70, 50),
    },
  ].map((r) => ({ ...r, location_id: location.id }));

  const { error: reviewsError } = await supabase.from("reviews").insert(reviews);
  if (reviewsError) throw reviewsError;
  console.log(`Inserted ${reviews.length} reviews`);

  console.log("\nDemo account ready:");
  console.log(`  email:    ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}`);
  console.log(`  location: ${location.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
