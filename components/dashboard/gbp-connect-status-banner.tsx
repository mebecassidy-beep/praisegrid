import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function GbpConnectStatusBanner({ status, message }: { status?: string; message?: string }) {
  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Google Business Profile connected. Full review history and reply-posting are now active for this location.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-400">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {message || "Couldn't connect Google Business Profile. Please try again."}
      </div>
    );
  }

  return null;
}
