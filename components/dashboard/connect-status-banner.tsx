import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function ConnectStatusBanner({
  status,
  message,
  connectedMessage,
  defaultErrorMessage,
}: {
  status?: string;
  message?: string;
  connectedMessage: string;
  defaultErrorMessage: string;
}) {
  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        {connectedMessage}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-400">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {message || defaultErrorMessage}
      </div>
    );
  }

  return null;
}
