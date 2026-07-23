"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Which review platforms does Reputicious support?",
    answer:
      "We currently sync with Google Business Profile, Yelp, and Facebook. Reviews from all three show up in one dashboard, and you can filter or respond per platform.",
  },
  {
    question: "How does the AI-drafted response feature work?",
    answer:
      "When a new review comes in, Reputicious drafts a response trained on your business's tone and past replies. You can approve it as-is, regenerate it, or edit it before it's posted.",
  },
  {
    question: "What are auto-approve rules?",
    answer:
      "Auto-approve rules let you set confidence thresholds and star-rating cutoffs so low-risk responses (like a positive 5-star review) can post automatically, while anything more sensitive is flagged for you to review first.",
  },
  {
    question: "Can I manage multiple business locations?",
    answer:
      "Yes, the Pro plan supports up to 5 locations, each with its own review feed, response settings, and analytics. You can switch between locations from the dashboard.",
  },
  {
    question: "Do I need a credit card to start a trial?",
    answer: "No. The 14-day free trial doesn't require a credit card, and you can cancel anytime.",
  },
  {
    question: "How is my data handled?",
    answer:
      "We only connect to the review platforms you explicitly authorize, and we don't sell your data. See our Privacy Policy for the full details.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-xl border">
      {FAQS.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.question}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
              />
            </button>
            {open && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
