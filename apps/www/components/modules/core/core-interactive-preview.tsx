"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";

const VIEWS = ["Customers", "Sales", "Expenses", "Team"] as const;
type View = (typeof VIEWS)[number];

const VIEW_META: Record<
  View,
  {
    headline: string;
    items: { title: string; meta: string }[];
    note: string;
  }
> = {
  Customers: {
    headline: "Your book of business",
    items: [
      { title: "Ama Owusu", meta: "VIP · balance GHS 420 · last visit yesterday" },
      { title: "Northline Wholesale", meta: "B2B · 12 sales this month" },
      { title: "Kojo Adjei", meta: "Walk-in · tagged for follow-up" },
    ],
    note: "History stays with the customer when you add invoicing, POS, or storefront later.",
  },
  Sales: {
    headline: "Cash, mobile money, and card",
    items: [
      { title: "Quick sale · GHS 180", meta: "Mobile money · counter" },
      { title: "Quick sale · GHS 65", meta: "Cash · walk-in" },
      { title: "Quick sale · GHS 240", meta: "Card · afternoon rush" },
    ],
    note: "Daily sales land in Core first: modules deepen the workflow later.",
  },
  Expenses: {
    headline: "Spend you can actually explain",
    items: [
      { title: "Restock run", meta: "GHS 95 · receipt attached" },
      { title: "Fuel", meta: "GHS 120 · transport category" },
      { title: "Packaging", meta: "GHS 40 · needs review" },
    ],
    note: "Categories and photos mean end-of-month is less guesswork.",
  },
  Team: {
    headline: "Invite people with the right access",
    items: [
      { title: "Owner", meta: "Full access · branch overview" },
      { title: "Cashier", meta: "Sales only · no expense edit" },
      { title: "Manager", meta: "Sales + expenses · alerts" },
    ],
    note: "Granular permissions keep growing teams under control.",
  },
};

export function CoreInteractivePreview() {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<View>("Customers");
  const meta = VIEW_META[view];

  return (
    <section className="relative overflow-hidden bg-[#122038] section-padding text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_0%,rgba(70,116,52,0.28),transparent)]" />
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light" aria-hidden />

      <div className="container-site relative">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-tangerine">
            Interactive preview
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            See what Core covers on day one.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Switch views to explore customers, sales, expenses, and team access.
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2">
            {VIEWS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  view === item
                    ? "bg-brand-leaf-green text-white shadow-lg shadow-brand-leaf-green/30"
                    : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-[#0e120e] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-bold">Modufy Core</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={view}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                    className="text-xs text-muted-foreground"
                  >
                    {meta.headline}
                  </motion.p>
                </AnimatePresence>
              </div>
              <span className="rounded-full bg-brand-leaf-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-leaf-green">
                Included
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.ul
                  key={view}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {meta.items.map((item) => (
                    <li
                      key={item.title}
                      className="rounded-2xl border border-border bg-[#f7f5f1] px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-[#0e120e]">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
              <p className="mt-5 text-sm text-muted-foreground">{meta.note}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
