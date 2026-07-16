"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";

const STATUSES = ["Draft", "Sent", "Paid", "Overdue"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_META: Record<
  Status,
  { badge: string; badgeClass: string; paid: number; note: string }
> = {
  Draft: {
    badge: "Draft",
    badgeClass: "bg-[#f4f1ea] text-[#6f6f6f]",
    paid: 0,
    note: "Ready to review before sending",
  },
  Sent: {
    badge: "Sent",
    badgeClass: "bg-blue-50 text-blue-700",
    paid: 0,
    note: "Awaiting customer payment",
  },
  Paid: {
    badge: "Paid",
    badgeClass: "bg-brand-leaf-green/15 text-brand-leaf-green",
    paid: 2484,
    note: "Full payment recorded and synced",
  },
  Overdue: {
    badge: "Overdue",
    badgeClass: "bg-red-50 text-red-600",
    paid: 800,
    note: "Partial payment · reminder scheduled",
  },
};

export function InvoicingInteractivePreview() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("Paid");
  const meta = STATUS_META[status];
  const springPaid = useSpring(meta.paid, { stiffness: 90, damping: 18 });
  const [paidLabel, setPaidLabel] = useState(meta.paid.toLocaleString());

  useEffect(() => {
    springPaid.set(meta.paid);
  }, [meta.paid, springPaid]);

  useEffect(() => {
    return springPaid.on("change", (value) => {
      setPaidLabel(Math.round(value).toLocaleString());
    });
  }, [springPaid]);

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
            See how professional billing should feel.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Switch statuses to preview how an invoice looks as it moves through your workflow.
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2">
            {STATUSES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  status === item
                    ? "bg-brand-leaf-green text-white shadow-lg shadow-brand-leaf-green/30"
                    : "border border-white/25 bg-white/10 text-white/85 hover:bg-white/15 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-[#1a2744] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-bold">INV-2048 · Riverfront Retail</p>
                <p className="text-xs text-muted-foreground">Issued 12 Mar 2026 · Due 26 Mar 2026</p>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={status}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${meta.badgeClass}`}
                >
                  {meta.badge}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Line items
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between gap-4">
                    <span>Wireless barcode scanner × 2</span>
                    <span className="font-semibold">$1,240</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>Shelf restock kit × 1</span>
                    <span className="font-semibold">$380</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>On-site setup × 1</span>
                    <span className="font-semibold">$450</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#f7f5f1] p-4">
                <div className="space-y-1.5 text-sm">
                  <Row label="Subtotal" value="$2,070.00" />
                  <Row label="Tax" value="$310.50" />
                  <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold text-[#111]">
                    <span>Total</span>
                    <span className="text-brand-leaf-green">$2,484.00</span>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-border bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#666]">
                    Payments recorded
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-brand-leaf-green">
                    ${paidLabel}
                  </p>
                  <p className="mt-1 text-xs text-[#555]">{meta.note}</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#444]">
      <span>{label}</span>
      <span className="font-semibold text-[#222]">{value}</span>
    </div>
  );
}
