import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  crons: [
    { path: "/api/cron/reports", schedule: "0 13 * * *" },
    { path: "/api/cron/competitor-report", schedule: "0 14 * * 1" },
    { path: "/api/cron/send-scheduled-blasts", schedule: "*/15 * * * *" },
  ],
};
