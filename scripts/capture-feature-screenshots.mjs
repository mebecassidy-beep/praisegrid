// Captures high-DPI screenshots of live dashboard states for the marketing
// feature page, using the demo account seeded by scripts/seed-demo-screenshots.mjs.
// Requires `npm run dev` already running at http://localhost:3000.
//
// Usage: node scripts/capture-feature-screenshots.mjs

import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.CAPTURE_BASE_URL || "http://localhost:3000";
const DEMO_EMAIL = "demo-screenshots@praisegrid.com";
const DEMO_PASSWORD = "ScreenshotDemo2026!";
const OUT_DIR = path.resolve(process.cwd(), "public/assets/features-high-converting");

// deviceScaleFactor 2 on a 1200x750 viewport renders at 2400x1500 physical
// pixels — the "ultra-high-resolution" target — while keeping the app's
// actual CSS layout (breakpoints, font sizes) identical to a normal desktop
// view, unlike literally sizing the viewport to 2400x1500.
const VIEWPORT = { width: 1200, height: 750 };

// Shared card wrapper classes from components/ui/card.tsx — used to select a
// whole feature card by the text inside it, without needing test ids. Only
// `rounded-xl` + `bg-card` are used (not `border`): cn()'s tailwind-merge
// drops the base `border` class whenever a card conditionally adds
// `border-2` (e.g. the crisis-flagged review card), so selecting on it would
// silently miss exactly the card we care about most.
const CARD = (text) => `div.rounded-xl.bg-card:has-text("${text}")`;

async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder("you@business.com").fill(DEMO_EMAIL);
  await page.getByPlaceholder("Your password").fill(DEMO_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 15000 });
}

async function captureCrisisShield(page) {
  await page.goto(`${BASE_URL}/reviews`);
  const card = page.locator(CARD("Jordan T.")).first();
  await card.waitFor({ state: "visible" });

  const generateBtn = card.getByRole("button", { name: "Generate response" });
  if (await generateBtn.isVisible().catch(() => false)) {
    await generateBtn.click();
    await card.getByRole("button", { name: "Approve & Post" }).waitFor({ timeout: 30000 });
  }

  await card.screenshot({ path: path.join(OUT_DIR, "crisis-shield.png") });
  console.log("Saved crisis-shield.png");
}

async function captureAiBrandVoice(page) {
  await page.goto(`${BASE_URL}/reviews`);
  const card = page.locator(CARD("Casey M.")).first();
  await card.scrollIntoViewIfNeeded();
  await card.waitFor({ state: "visible" });

  const generateBtn = card.getByRole("button", { name: "Generate response" });
  if (await generateBtn.isVisible().catch(() => false)) {
    await generateBtn.click();
    await card.getByRole("button", { name: "Approve & Post" }).waitFor({ timeout: 30000 });
  }

  await card.screenshot({ path: path.join(OUT_DIR, "ai-brand-voice.png") });
  console.log("Saved ai-brand-voice.png");
}

async function captureCompetitorRadar(page) {
  await page.goto(`${BASE_URL}/analytics`);
  const card = page.locator(CARD("Local competitor leak finder")).first();
  await card.scrollIntoViewIfNeeded();
  await card.waitFor({ state: "visible" });

  const scanBtn = card.getByRole("button", { name: /Scan competitor reviews/ });
  if (await scanBtn.isVisible().catch(() => false)) {
    await scanBtn.click();
    await card.getByRole("button", { name: "Rescan competitor reviews" }).waitFor({ timeout: 30000 });
  }

  await card.screenshot({ path: path.join(OUT_DIR, "competitor-radar.png") });
  console.log("Saved competitor-radar.png");
}

async function captureRevenueForensics(page) {
  await page.goto(`${BASE_URL}/analytics`);
  const card = page.locator(CARD("Reputation Revenue Forensics")).first();
  await card.scrollIntoViewIfNeeded();
  await card.waitFor({ state: "visible" });
  // Real data computed by lib/analytics/revenue-forensics.ts from the seeded
  // rescued reviews — nothing to trigger here, just wait for the numbers
  // rendered server-side to be on screen.
  await page.waitForTimeout(300);

  await card.screenshot({ path: path.join(OUT_DIR, "revenue-forensics.png") });
  console.log("Saved revenue-forensics.png");
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const page = await context.newPage();

  await login(page);
  await captureCrisisShield(page);
  await captureAiBrandVoice(page);
  await captureCompetitorRadar(page);
  await captureRevenueForensics(page);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
