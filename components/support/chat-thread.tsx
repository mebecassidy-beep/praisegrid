"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/components/support/use-support-chat";

interface ContentPart {
  type: "text" | "code";
  value: string;
}

function splitContent(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const regex = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "code", value: match[1].trim() });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }
  return parts;
}

function CodeBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const isBugReport = value.startsWith("[BUG REPORT]");

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-950/70">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {isBugReport ? "Bug report, ready to send to your engineer" : "Code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-slate-400 transition-colors hover:text-white"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words p-3 text-xs leading-relaxed text-slate-200">
        {value}
      </pre>
    </div>
  );
}

export function ChatThread({ messages, loading }: { messages: ChatMessage[]; loading: boolean }) {
  return (
    <>
      {messages.map((m, i) => (
        <div
          key={i}
          className={cn(
            "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
            m.role === "user"
              ? "ml-auto bg-gradient-to-r from-blue-500 to-violet-600 text-white"
              : "border border-white/10 bg-white/5 text-slate-100"
          )}
        >
          {splitContent(m.content).map((part, j) =>
            part.type === "code" ? (
              <CodeBlock key={j} value={part.value} />
            ) : part.value.trim() ? (
              <p key={j} className="whitespace-pre-wrap break-words">
                {part.value.trim()}
              </p>
            ) : null
          )}
        </div>
      ))}
      {loading && (
        <div className="flex max-w-[85%] items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        </div>
      )}
    </>
  );
}
