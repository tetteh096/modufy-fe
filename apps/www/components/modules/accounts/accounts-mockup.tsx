"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDownLeft, ArrowUpRight, Check } from "lucide-react";

const ENTRIES = [
  { src: "POS", label: "Counter sale · clay bar", amount: "+$78.00", dir: "in" as const },
  { src: "Invoice", label: "INV-1042 payment", amount: "+$420.00", dir: "in" as const },
  { src: "Expense", label: "Supplier restock", amount: "−$140.00", dir: "out" as const },
  { src: "Inventory", label: "COGS · gift set", amount: "−$42.00", dir: "out" as const },
] as const;

export function AccountsMockup() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(1);
  const [pl, setPl] = useState(4820);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(ENTRIES.length);
      setPl(5136);
      return;
    }
    const id = window.setInterval(() => {
      setVisible((v) => {
        const next = v >= ENTRIES.length ? 1 : v + 1;
        setPl(4800 + next * 84);
        return next;
      });
    }, 1800);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <motion.div
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12161f] text-white shadow-[0_32px_90px_rgba(0,0,0,0.35)]"
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Ledger</p>
            <p className="font-display text-lg font-bold">Auto-posted today</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-leaf-green/20 px-3 py-1 text-xs font-bold text-brand-leaf-green">
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-dot-ring absolute inline-flex h-full w-full rounded-full bg-brand-leaf-green opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-leaf-green" />
            </span>
            Live
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="rounded-xl bg-white/5 px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">P&L · MTD</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={pl}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 font-display text-2xl font-bold text-[#e8f0a8]"
              >
                ${pl.toLocaleString()}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="rounded-xl bg-white/5 px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">Cash flow</p>
            <p className="mt-1 font-display text-2xl font-bold">+$2.1k</p>
          </div>
        </div>

        <ul className="min-h-[220px] space-y-2 px-4 py-4 sm:px-5">
          <AnimatePresence initial={false}>
            {ENTRIES.slice(0, visible).map((entry) => (
              <motion.li
                key={entry.label}
                initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      entry.dir === "in"
                        ? "bg-brand-leaf-green/20 text-brand-leaf-green"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {entry.dir === "in" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                      {entry.src}
                    </p>
                    <p className="truncate text-sm font-semibold">{entry.label}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-sm font-bold ${
                    entry.dir === "in" ? "text-brand-leaf-green" : "text-white/70"
                  }`}
                >
                  {entry.amount}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="border-t border-white/10 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-leaf-green">
            <Check className="h-4 w-4" />
            Double-entry balanced · no re-keying
          </div>
        </div>
      </motion.div>
    </div>
  );
}
