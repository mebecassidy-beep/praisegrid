import { cn } from "@/lib/utils";

/** Realistic "person you're chatting with" signal: initials avatar plus a
 * pulsing green presence dot, the same shorthand Slack/Intercom/iMessage use
 * for "there's an actual person on the other end right now." */
export function AgentAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 font-semibold text-white",
          size === "md" ? "h-11 w-11 text-base" : "h-9 w-9 text-sm"
        )}
      >
        S
      </div>
      <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
      </span>
    </div>
  );
}
