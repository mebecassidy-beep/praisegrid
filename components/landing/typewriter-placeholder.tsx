"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED_MS = 55;
const DELETE_SPEED_MS = 30;
const HOLD_MS = 1400;

/**
 * Cycles through example strings as an animated "typing" placeholder —
 * only meaningful while the field is empty; the caller should stop reading
 * this once the user has typed something real.
 */
export function useTypewriterPlaceholder(examples: string[]): string {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const current = examples[exampleIndex % examples.length];

    if (phase === "typing") {
      if (text.length < current.length) {
        const timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPE_SPEED_MS);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => setPhase("holding"), HOLD_MS);
      return () => clearTimeout(timeout);
    }

    if (phase === "holding") {
      const timeout = setTimeout(() => setPhase("deleting"), HOLD_MS);
      return () => clearTimeout(timeout);
    }

    // deleting
    if (text.length > 0) {
      const timeout = setTimeout(() => setText(text.slice(0, -1)), DELETE_SPEED_MS);
      return () => clearTimeout(timeout);
    }
    setExampleIndex((i) => (i + 1) % examples.length);
    setPhase("typing");
  }, [text, phase, exampleIndex, examples]);

  return text;
}
