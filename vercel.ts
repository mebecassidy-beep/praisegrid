import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  crons: [
    { path: "/api/cron/reports", schedule: "0 13 * * *" },
    { path: "/api/cron/competitor-report", schedule: "0 14 * * 1" },
    // Hobby plan caps crons at once/day, so scheduled blasts are checked
    // once daily instead of every 15 minutes. "2h"/"next morning" sends may
    // land up to ~24h late as a result; upgrade to Pro for tighter
    // smart-timing precision (then this can go back to e.g. "*/15 * * * *").
    { path: "/api/cron/send-scheduled-blasts", schedule: "0 15 * * *" },
  ],
};
