"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";

const VIEWS = ["Products", "Services", "Suppliers", "Alerts"] as const;
type View = (typeof VIEWS)[number];

const VIEW_META: Record<
  View,
  {
    headline: string;
    items: { title: string; meta: string }[];
    note: string;
  }
> = {
  Products: {
    headline: "Physical stock with variants and barcodes",
    items: [
      { title: "Clay conditioning bar", meta: "SKU-118 · 120 on hand · GHS 85" },
      { title: "Shelf spray refill", meta: "SKU-204 · 18 on hand · low threshold 20" },
      { title: "Gift set · 3-pack", meta: "Variant · cost GHS 140 · sell GHS 220" },
    ],
    note: "Sell through POS, invoices, or storefront — quantity updates in one catalog.",
  },
  Services: {
    headline: "Billable work beside the products",
    items: [
      { title: "Studio consult", meta: "45 min · bookable · GHS 150" },
      { title: "Colour refresh", meta: "Fixed rate · from GHS 180" },
      { title: "Private fitting", meta: "Enquiry only · not public" },
    ],
    note: "Bookable flags connect cleanly when you enable Appointments.",
  },
  Suppliers: {
    headline: "Purchase orders without another app",
    items: [
      { title: "PO #882 · Greenfield Supplies", meta: "40 units · expected Fri" },
      { title: "PO #879 · Coastal Pack Co.", meta: "Received · stock increased" },
      { title: "Supplier · Northline Wholesale", meta: "Avg lead time 4 days" },
    ],
    note: "Restock against suppliers and keep a movement trail you can audit.",
  },
  Alerts: {
    headline: "Stay ahead of stockouts",
    items: [
      { title: "Low stock · Shelf spray refill", meta: "18 left · reorder suggested" },
      { title: "Write-off pending approval", meta: "1 damaged unit · manager review" },
      { title: "Valuation snapshot", meta: "FIFO · GHS 48,220 on hand" },
    ],
    note: "Alerts and valuation reports help retail and wholesale teams plan.",
  },
};

export function InventoryInteractivePreview() {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<View>("Products");
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
            See how Inventory keeps every channel in sync.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Switch views across products, services, suppliers, and alerts.
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

          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-[#1a2744] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-bold">Inventory &amp; Stock</p>
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
                Live catalog
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
                      <p className="text-sm font-semibold text-[#1a2744]">{item.title}</p>
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
