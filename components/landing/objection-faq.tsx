"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Is the AI going to post something embarrassing without my okay?",
    answer:
      "Only if you let it. Every AI-drafted response sits in a queue for your 1-click approval by default. Auto-approve rules are opt-in, you choose exactly which conditions (star rating, confidence threshold, keyword filters) are safe to post automatically, and you can turn auto-approve off entirely at any time.",
  },
  {
    question: "Will this get my Google Business Profile suspended?",
    answer:
      "No. Praisegrid connects through Google's and Meta's official, sanctioned APIs, no scraping, no credential sharing, no automation that violates platform terms. Every sync and auto-post stays within Google's and Meta's review-response guidelines.",
  },
  {
    question: "How long does setup actually take?",
    answer:
      "Most businesses are fully connected in under 3 minutes: sign up, connect your Google Business Profile in 2 clicks, and you're seeing live data. Yelp and Facebook connect the same way from inside your dashboard whenever you're ready.",
  },
  {
    question: "I manage multiple locations, can Praisegrid handle that?",
    answer:
      "Yes. The Pro plan supports up to 5 locations, each with its own review feed, response settings, and analytics, and you can switch between them from a single dashboard.",
  },
  {
    question: "Do I need a credit card to start?",
    answer: "No. The 14-day free trial doesn't require a credit card, and you can cancel anytime with 1 click.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "We only connect to the platforms you explicitly authorize and never sell your data. If you cancel, we stop syncing immediately, see our Privacy Policy for full details.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // Generated directly from FAQS above so the structured data can never
  // drift from what's actually rendered on the page.
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function ObjectionFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-white/10 bg-slate-950 py-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Questions local business owners actually ask
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Straight answers before you start your free trial.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open}
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate-500 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm leading-relaxed text-slate-400">{faq.answer}</div>
                )}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
