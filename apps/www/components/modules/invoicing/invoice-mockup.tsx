"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Check, MessageCircle, RefreshCw } from "lucide-react";

const LINE_ITEMS = [
  { name: "Wireless barcode scanner", qty: 2, amount: "$1,240.00" },
  { name: "Shelf restock kit", qty: 1, amount: "$380.00" },
  { name: "On-site setup", qty: 1, amount: "$450.00" },
] as const;

export function InvoiceMockup() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [paid, setPaid] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });
  const transform = useMotionTemplate`perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  useEffect(() => {
    if (reduceMotion) {
      setPaid(true);
      return;
    }
    const timer = window.setTimeout(() => setPaid(true), 2200);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-[480px]"
    >
      <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#467434]/35 blur-[70px]" />
      <div className="absolute -right-4 bottom-8 h-44 w-44 rounded-full bg-[#F58F20]/25 blur-[80px]" />

      <motion.div
        style={reduceMotion ? undefined : { transform }}
        className="relative"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,28,46,0.22)]">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-leaf-green text-sm font-bold text-white">
                M
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a2744]">MODUFY TRADING</p>
                <p className="text-[11px] text-muted-foreground">Invoice INV-2048</p>
              </div>
            </div>
            <motion.span
              key={paid ? "paid" : "sent"}
              initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                paid
                  ? "bg-brand-leaf-green/15 text-brand-leaf-green shadow-[0_0_24px_rgba(70,116,52,0.35)]"
                  : "bg-[#f4f1ea] text-[#6f6f6f]"
              }`}
            >
              {paid ? "Paid" : "Sent"}
            </motion.span>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold uppercase tracking-[0.14em] text-muted-foreground">Bill to</p>
                <p className="mt-1 font-semibold text-[#1a2744]">Riverfront Retail</p>
                <p className="text-muted-foreground">Alex Rivera</p>
              </div>
              <div className="text-right">
                <p className="font-semibold uppercase tracking-[0.14em] text-muted-foreground">Dates</p>
                <p className="mt-1 text-[#1a2744]">Issued 12 Mar 2026</p>
                <p className="text-muted-foreground">Due 26 Mar 2026</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="grid grid-cols-[1fr_auto_auto] gap-2 bg-[#f7f5f1] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Item</span>
                <span>Qty</span>
                <span>Amount</span>
              </div>
              {LINE_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="grid grid-cols-[1fr_auto_auto] gap-2 border-t border-border px-3 py-2.5 text-xs"
                >
                  <span className="font-medium text-[#1a2744]">{item.name}</span>
                  <span className="text-muted-foreground">{item.qty}</span>
                  <span className="font-semibold text-[#1a2744]">{item.amount}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                ["Subtotal", "$2,070.00"],
                ["Tax", "$310.50"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-muted-foreground">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-bold text-[#1a2744]">
                <span>Total</span>
                <span>$2,484.00</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute -left-3 bottom-16 hidden w-[190px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-black/10 sm:block"
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
              <MessageCircle className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">WhatsApp</p>
              <p className="text-xs font-semibold text-[#1a2744]">Invoice shared</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -right-2 top-20 hidden w-[180px] rounded-2xl border border-white/80 bg-[#1a2744] p-3 text-white shadow-xl shadow-black/25 sm:block"
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-leaf-green/20 text-brand-leaf-green">
              <RefreshCw className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">Accounts</p>
              <p className="text-xs font-semibold">Payment synced</p>
            </div>
          </div>
          {paid && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-leaf-green"
            >
              <Check className="h-3.5 w-3.5" />
              $2,484.00 posted
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
