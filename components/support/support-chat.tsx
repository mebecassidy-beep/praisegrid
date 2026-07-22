"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, User, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi! I'm the Reputicious support assistant. Ask me anything about plans, features, or your account.",
};

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [email, setEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Try the \"Talk to a human\" button below." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleEscalate() {
    setEscalated(true);
    try {
      await fetch("/api/support/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: messages, email }),
      });
    } catch {
      // Escalation confirmation is optimistic — the user already sees the
      // "we'll be in touch" message regardless of network hiccups here.
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <Card className="mb-3 flex h-[480px] w-80 flex-col overflow-hidden shadow-2xl sm:w-96">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
            <p className="text-sm font-semibold">Support chat</p>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-gradient-to-r from-blue-500 to-violet-600 text-white"
                    : "bg-muted text-foreground"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                Thinking…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-3">
            {escalated ? (
              <p className="text-center text-xs text-muted-foreground">
                Thanks — a real human will follow up{email ? ` at ${email}` : ""} shortly.
              </p>
            ) : (
              <div className="mb-2 flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Your email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleEscalate}
                  className="h-8 shrink-0 gap-1.5 whitespace-nowrap text-xs"
                >
                  <User className="h-3.5 w-3.5" />
                  Talk to a human
                </Button>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="h-9"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      <Button
        onClick={() => setOpen((v) => !v)}
        size="icon"
        aria-label={open ? "Close support chat" : "Open support chat"}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 shadow-xl hover:opacity-90"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
