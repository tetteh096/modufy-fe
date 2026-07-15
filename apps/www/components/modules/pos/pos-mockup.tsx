"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ScanBarcode, User } from "lucide-react";

const GRID = [
  { name: "Clay bar", price: 24, sku: "118" },
  { name: "Shelf spray", price: 16, sku: "204" },
  { name: "Gift set", price: 68, sku: "290" },
  { name: "Linen apron", price: 38, sku: "331" },
  { name: "Consult", price: 85, sku: "SVC" },
  { name: "Refill pack", price: 22, sku: "410" },
] as const;

type CartLine = { name: string; price: number };

type Step = {
  cart: CartLine[];
  activeSku: string | null;
  held: boolean;
  paid: boolean;
};

const STEPS: Step[] = [
  {
    cart: [{ name: "Clay bar", price: 24 }],
    activeSku: null,
    held: false,
    paid: false,
  },
  {
    cart: [
      { name: "Clay bar", price: 24 },
      { name: "Shelf spray", price: 16 },
    ],
    activeSku: "204",
    held: false,
    paid: false,
  },
  {
    cart: [
      { name: "Clay bar", price: 24 },
      { name: "Shelf spray", price: 16 },
      { name: "Gift set", price: 68 },
    ],
    activeSku: "290",
    held: true,
    paid: false,
  },
  {
    cart: [
      { name: "Clay bar", price: 24 },
      { name: "Shelf spray", price: 16 },
      { name: "Gift set", price: 68 },
    ],
    activeSku: "290",
    held: true,
    paid: true,
  },
];

export function PosMockup() {
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex] ?? STEPS[0];
  const total = step.cart.reduce((sum, line) => sum + line.price, 0);

  useEffect(() => {
    if (reduceMotion) {
      setStepIndex(STEPS.length - 1);
      return;
    }
    const id = window.setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <motion.div
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12161f] text-white shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <User className="h-4 w-4 text-white/60" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                Session open
              </p>
              <p className="text-base font-bold">Front counter</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step.held ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full bg-brand-tangerine/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-tangerine"
              >
                1 held
              </motion.span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-leaf-green/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-leaf-green">
              <span className="relative flex h-1.5 w-1.5">
                <span className="pulse-dot-ring absolute inline-flex h-full w-full rounded-full bg-brand-leaf-green opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-leaf-green" />
              </span>
              Live
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[1.2fr_0.9fr] gap-0">
          <div className="border-r border-white/10 p-3">
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2 text-xs text-white/45">
              <ScanBarcode className="h-3.5 w-3.5" />
              Scan or search SKU…
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {GRID.map((item) => {
                const on = step.activeSku === item.sku;
                return (
                  <div
                    key={item.sku}
                    className={`rounded-xl p-2.5 ring-1 transition duration-300 ${
                      on
                        ? "bg-brand-leaf-green/20 ring-brand-leaf-green/50"
                        : "bg-white/[0.04] ring-white/10"
                    }`}
                  >
                    <p className="truncate text-xs font-semibold">{item.name}</p>
                    <p className="mt-1 text-[11px] text-white/40">${item.price}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col p-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">Cart</p>
            <ul className="mt-2 min-h-[120px] flex-1 space-y-1.5">
              <AnimatePresence initial={false}>
                {step.cart.map((line, i) => (
                  <motion.li
                    key={`${line.name}-${i}`}
                    initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-lg bg-white/[0.04] px-2.5 py-2 text-xs"
                  >
                    <span className="font-medium text-white/85">{line.name}</span>
                    <span className="text-white/50">${line.price}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-2 border-t border-white/10 pt-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/45">{step.cart.length} items</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={total}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-bold"
                  >
                    ${total}.00
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-full bg-brand-leaf-green py-2.5 text-sm font-bold">
                <Check className="h-3.5 w-3.5" />
                Charge ${total}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {step.paid ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute inset-x-4 bottom-4 rounded-xl border border-brand-leaf-green/30 bg-[#0c100e]/95 px-3 py-2.5 text-sm font-semibold text-brand-leaf-green backdrop-blur-md"
            >
              Paid · stock deducted · receipt ready
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
