"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 700);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur-lg"
        >
          <div className="container flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-sm font-medium text-slate-200">
              Ready to save 5+ hours a week and rescue negative reviews instantly?
            </p>
            <div className="flex items-center gap-3">
              <p className="hidden text-xs font-semibold text-slate-500 sm:block">
                No credit card required • Cancel anytime with 1-click
              </p>
              <Button
                asChild
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
