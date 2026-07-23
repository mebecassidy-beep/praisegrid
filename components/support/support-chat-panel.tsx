"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatThread } from "@/components/support/chat-thread";
import { MicButton } from "@/components/support/mic-button";
import { AgentAvatar } from "@/components/support/agent-avatar";
import { useSupportChat } from "@/components/support/use-support-chat";

/** Always-open, embedded chat panel for the split-screen Support Center
 * page, the interactive preview half. Shares state logic with the floating
 * widget via useSupportChat but renders inline instead of fixed/floating. */
export function SupportChatPanel() {
  const chat = useSupportChat({
    role: "assistant",
    content: "Hi, I'm Sam from Reputicious. Go ahead, ask me anything.",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.loading]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await chat.sendMessage(chat.input);
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-500/30 to-violet-600/30 p-px">
      <div className="flex h-[540px] w-full flex-col overflow-hidden rounded-2xl bg-slate-900 sm:h-[600px]">
        <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-violet-600/10 px-4 py-3 sm:px-5">
          <AgentAvatar size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Sam</p>
            <p className="text-xs text-slate-400">Active now, from Reputicious</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          <ChatThread messages={chat.messages} loading={chat.loading} />
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/10 p-3 sm:p-4">
          <div className="mb-2 flex justify-end">
            {chat.escalated ? (
              <p className="text-xs text-slate-400">A real human will follow up shortly.</p>
            ) : (
              <button
                type="button"
                onClick={chat.escalate}
                className="flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-white"
              >
                <User className="h-3 w-3" />
                Talk to a human
              </button>
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <Input
              value={chat.input}
              onChange={(e) => chat.setInput(e.target.value)}
              placeholder="Ask a question…"
              className="h-9 min-w-0 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
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
        </div>
      </div>
    </div>
  );
}
