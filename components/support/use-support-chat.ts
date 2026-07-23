"use client";

import { useState } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_GREETING: ChatMessage = {
  role: "assistant",
  content: "Hey, I'm Sam from Reputicious. What can I help with?",
};

function reportClientError(context: string) {
  if (typeof window === "undefined") return;
  fetch("/api/support/report-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context, page: window.location.pathname }),
  }).catch(() => {
    // Best-effort only, the user already sees a friendly fallback message.
  });
}

export function useSupportChat(initialGreeting: ChatMessage = DEFAULT_GREETING) {
  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    // Automation is paused once a human has taken over, no further AI
    // replies should generate while a teammate is working the thread.
    if (!trimmed || loading || escalated) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
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
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong on my end. Try again in a moment, or use \"Talk to a human\" below.",
        },
      ]);
      reportClientError(err?.message || "Chat request failed");
    } finally {
      setLoading(false);
    }
  }

  function addAssistantMessage(content: string) {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  }

  async function escalate() {
    setEscalated(true);
    try {
      await fetch("/api/support/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: messages }),
      });
    } catch {
      // Escalation confirmation is optimistic, the user already sees the
      // "we'll be in touch" message regardless of network hiccups here.
    }
  }

  return {
    messages,
    input,
    setInput,
    loading,
    sendMessage,
    addAssistantMessage,
    escalated,
    escalate,
  };
}
