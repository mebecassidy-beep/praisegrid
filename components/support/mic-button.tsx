"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  onResult: (transcript: string) => void;
  className?: string;
}

/** Client-side only, no backend involved: Web Speech API speech-to-text for
 * hands-free question input. Silently renders nothing on browsers without
 * SpeechRecognition support (notably desktop Firefox) rather than showing a
 * dead button. */
export function MicButton({ onResult, className }: MicButtonProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) onResultRef.current(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.abort?.();
    };
  }, []);

  if (!supported) return null;

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      aria-label={listening ? "Stop voice input" : "Speak your question"}
      title={listening ? "Stop voice input" : "Speak your question"}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-slate-300 transition-colors hover:bg-white/10 hover:text-white",
        listening && "animate-pulse border-red-400/40 bg-red-500/10 text-red-300",
        className
      )}
    >
      {listening ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-4 w-4" />}
    </button>
  );
}
