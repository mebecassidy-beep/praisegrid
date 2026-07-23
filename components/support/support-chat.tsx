"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, MessageCircle, Send, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatThread } from "@/components/support/chat-thread";
import { MicButton } from "@/components/support/mic-button";
import { AgentAvatar } from "@/components/support/agent-avatar";
import { useSupportChat } from "@/components/support/use-support-chat";

// Pages where a dwelling, non-interacting visitor is likely weighing price,
// worth proactively offering help before they bounce.
const NUDGE_PATHS = ["/", "/features"];
const NUDGE_DELAY_MS = 20_000;
const NUDGE_STORAGE_KEY = "reputicious_support_nudge_shown";

export function SupportChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const chat = useSupportChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.loading]);

  useEffect(() => {
    if (open || pathname === "/support") return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(NUDGE_STORAGE_KEY)) return;
    if (!NUDGE_PATHS.includes(pathname)) return;

    const timer = setTimeout(() => {
      setNudge(true);
      sessionStorage.setItem(NUDGE_STORAGE_KEY, "1");
    }, NUDGE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [pathname, open]);

  function openWithPricingHelp() {
    setNudge(false);
    setOpen(true);
    chat.addAssistantMessage(
      "Hey! Looks like you might be comparing plans. How many locations are you running?"
    );
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await chat.sendMessage(chat.input);
  }

  // The support page has its own always-open embedded panel, showing the
  // floating bubble there too would just be a duplicate widget.
  if (pathname === "/support") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {nudge && !open && (
        <div className="w-[calc(100vw-2rem)] max-w-64 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <p className="text-sm text-slate-200">
              Questions about pricing? I can help you find the right plan in under a minute.
            </p>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setNudge(false)}
              className="text-xs font-medium text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
            <button
              onClick={openWithPricingHelp}
              className="rounded-md bg-gradient-to-r from-blue-500 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              Let&apos;s talk
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="flex h-[min(520px,calc(100vh-6rem))] w-[calc(100vw-2rem)] max-w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl sm:max-w-96">
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-violet-600/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <AgentAvatar />
              <div>
                <p className="text-sm font-semibold text-white">Sam</p>
                <p className="text-xs text-slate-400">Active now</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <ChatThread messages={chat.messages} loading={chat.loading} />
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 p-3">
            {chat.escalated ? (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <p className="text-xs leading-relaxed text-emerald-200">
                  A real human has this thread now and will follow up shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={chat.escalate}
                    className="flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    <User className="h-3 w-3" />
                    Talk to a human
                  </button>
                </div>

                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <Input
                    value={chat.input}
                    onChange={(e) => chat.setInput(e.target.value)}
                    placeholder="Ask a question…"
                    className="h-9 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                  />
                  <MicButton onResult={(t) => chat.setInput((prev) => (prev ? `${prev} ${t}` : t))} />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={chat.loading || !chat.input.trim()}
                    className="h-9 w-9 shrink-0 bg-gradient-to-r from-blue-500 to-violet-600 hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={() => {
          setNudge(false);
          setOpen((v) => !v);
        }}
        size="icon"
        aria-label={open ? "Close support chat" : "Open support chat"}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 shadow-xl shadow-blue-500/25 hover:opacity-90"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
