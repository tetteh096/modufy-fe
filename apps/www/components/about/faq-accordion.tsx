"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { marketingFaqs } from "@/lib/faq-content";
import { cn } from "@/lib/utils";

type FaqItem = { readonly question: string; readonly answer: string };

type FaqAccordionProps = {
  items?: readonly FaqItem[];
};

export function FaqAccordion({ items = marketingFaqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={cn(
              "overflow-hidden rounded-2xl border bg-card transition-colors",
              isOpen ? "border-brand-leaf-green/40 shadow-sm" : "border-border"
            )}
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-6"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span className="font-semibold leading-snug">Q: {item.question}</span>
              <span className="relative mt-0.5 h-5 w-5 shrink-0">
                <Image
                  src="/images/v3/plus.png"
                  alt=""
                  width={20}
                  height={20}
                  className={cn("absolute inset-0 transition-opacity", isOpen ? "opacity-0" : "opacity-100")}
                />
                <Image
                  src="/images/v3/minus.png"
                  alt=""
                  width={20}
                  height={20}
                  className={cn("absolute inset-0 transition-opacity", isOpen ? "opacity-100" : "opacity-0")}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground sm:px-6">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
