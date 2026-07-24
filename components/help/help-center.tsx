"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Mail,
  MapPin,
  MessageSquareText,
  Rocket,
  Search,
  Shield,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "Getting started" | "Reviews & AI" | "Locations & plans" | "Alerts & notifications" | "Data & privacy";

const CATEGORY_META: Record<Category, { icon: LucideIcon; accent: string }> = {
  "Getting started": { icon: Rocket, accent: "from-blue-500 to-cyan-400" },
  "Reviews & AI": { icon: Sparkles, accent: "from-violet-500 to-fuchsia-400" },
  "Locations & plans": { icon: MapPin, accent: "from-emerald-500 to-teal-400" },
  "Alerts & notifications": { icon: Bell, accent: "from-amber-500 to-orange-400" },
  "Data & privacy": { icon: Shield, accent: "from-slate-500 to-slate-400" },
};

const FAQS: { category: Category; question: string; answer: string }[] = [
  {
    category: "Getting started",
    question: "Which review platforms does Praisegrid support?",
    answer:
      "We currently sync with Google Business Profile. Yelp and Facebook connections are coming soon, you'll see them marked that way in Settings rather than hidden.",
  },
  {
    category: "Getting started",
    question: "How do I connect my Google Business Profile?",
    answer:
      "From the dashboard, click \"Connect Google Business Profile\" and search for your listing, we pull it directly from Google so your name, address, and reviews are accurate from the first sync.",
  },
  {
    category: "Getting started",
    question: "Do I need a credit card to start a trial?",
    answer: "No. The free trial doesn't require a credit card, and you can cancel anytime.",
  },
  {
    category: "Reviews & AI",
    question: "How does the AI-drafted response feature work?",
    answer:
      "When a new review comes in, Praisegrid drafts a response trained on your business's tone and past replies. You can approve it as-is, regenerate it, or edit it before it posts.",
  },
  {
    category: "Reviews & AI",
    question: "What are auto-approve rules?",
    answer:
      "Auto-approve rules let you set a star-rating threshold so low-risk responses (like a 5-star review) can post automatically, while anything more sensitive is flagged for you to review first.",
  },
  {
    category: "Reviews & AI",
    question: "What if a review looks fake?",
    answer:
      "Open the review and choose \"Looks fake? Dispute it.\" Describe why it doesn't look like a real customer and Praisegrid drafts a formal policy-violation request grounded only in what you provide, you submit it yourself through the platform's report flow.",
  },
  {
    category: "Reviews & AI",
    question: "Can I export my reviews?",
    answer:
      "Yes. The Reviews page has an Export CSV button that downloads whatever you currently have filtered, so you can pull just this month's Google reviews, or everything at once.",
  },
  {
    category: "Locations & plans",
    question: "Can I manage multiple business locations?",
    answer:
      "Yes. Paid plans support multiple locations, each with its own review feed and response settings, plus a Franchise View that compares every location side by side.",
  },
  {
    category: "Locations & plans",
    question: "How do I upgrade, downgrade, or cancel my plan?",
    answer:
      "Go to Settings > Billing. You'll find your current plan, a link to Stripe's billing portal for invoices and payment methods, and trial options if you're on the free plan.",
  },
  {
    category: "Alerts & notifications",
    question: "Will I know the moment a new review comes in?",
    answer:
      "Yes, the dashboard shows a live notification the instant a new review is synced, and updates your stats automatically without needing to refresh the page.",
  },
  {
    category: "Alerts & notifications",
    question: "Can I get alerted about urgent, crisis-level reviews specifically?",
    answer:
      "Yes. Add a Slack webhook URL in Settings and a high-risk review (like a public safety complaint) posts straight to your team's Slack channel in addition to the in-app alert.",
  },
  {
    category: "Data & privacy",
    question: "How is my data handled?",
    answer:
      "We only connect to the review platforms you explicitly authorize, and we don't sell your data. See our Privacy Policy for the full details.",
  },
];

function FaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium">{question}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HelpCenter() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((faq) => {
      const matchesQuery =
        q.length === 0 || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
      const matchesCategory = !activeCategory || faq.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const categories = Object.keys(CATEGORY_META) as Category[];

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 20%, rgba(59,130,246,0.22), transparent 40%), radial-gradient(circle at 75% 25%, rgba(139,92,246,0.2), transparent 42%)",
          }}
        />
        <div className="container relative mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <MessageSquareText className="h-3.5 w-3.5 text-blue-400" />
            Help Center
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Search for a topic, or browse by category below.
          </p>

          <div className="relative mx-auto mt-8 max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for answers…"
              className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                activeCategory === null
                  ? "border-blue-500 bg-blue-500/10 text-blue-600"
                  : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              All topics
            </button>
            {categories.map((category) => {
              const meta = CATEGORY_META[category];
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(active ? null : category)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-blue-500 bg-blue-500/10 text-blue-600"
                      : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <meta.icon className="h-3.5 w-3.5" />
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-10">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed py-16 text-center">
                <p className="text-sm font-medium">No results for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search, or{" "}
                  <Link href="/support" className="font-medium text-blue-600 hover:underline">
                    chat with support
                  </Link>
                  .
                </p>
              </div>
            ) : (
              Object.entries(
                filtered.reduce<Record<string, typeof FAQS>>((acc, faq) => {
                  (acc[faq.category] ??= []).push(faq);
                  return acc;
                }, {})
              ).map(([category, items]) => {
                const meta = CATEGORY_META[category as Category];
                return (
                  <div key={category} className="mb-10 last:mb-0">
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                          meta.accent
                        )}
                      >
                        <meta.icon className="h-3.5 w-3.5" />
                      </span>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {category}
                      </h2>
                    </div>
                    <div className="rounded-xl border bg-card px-5">
                      {items.map((faq) => (
                        <FaqItem
                          key={faq.question}
                          question={faq.question}
                          answer={faq.answer}
                          open={openQuestion === faq.question}
                          onToggle={() => setOpenQuestion(openQuestion === faq.question ? null : faq.question)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-16 flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold">Still stuck?</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Chat with our support agent for instant answers, or reach the team directly.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <MessageSquareText className="h-3.5 w-3.5" />
                Chat with support
              </Link>
              <a
                href="mailto:support@praisegrid.com"
                className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                <Mail className="h-3.5 w-3.5" />
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
