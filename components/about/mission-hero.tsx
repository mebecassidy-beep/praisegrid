"use client";

import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

export function MissionHero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 70% 60%, rgba(139,92,246,0.2), transparent 45%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
      >
        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
        Our mission
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
      >
        Every review is a conversation.{" "}
        <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          We make sure you never miss one.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mt-6 max-w-xl text-lg text-slate-400"
      >
        Reputicious exists because busy business owners were losing hours a week — and
        losing customers — to reviews that sat unanswered across three different apps.
      </motion.p>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative mt-16 flex flex-col items-center gap-1 text-slate-500"
      >
        <span className="text-xs font-medium uppercase tracking-wider">Scroll to see why</span>
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
}
