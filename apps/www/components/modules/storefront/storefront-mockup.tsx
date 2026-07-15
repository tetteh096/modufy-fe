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
import { Check, MessageSquare, ShoppingBag, Star } from "lucide-react";

const PRODUCTS = [
  { name: "Clay conditioning bar", price: "GHS 85", tag: "In stock" },
  { name: "Restock gift set", price: "GHS 220", tag: "Promo" },
  { name: "Studio consult", price: "GHS 150", tag: "Bookable" },
] as const;

export function StorefrontMockup() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });
  const transform = useMotionTemplate`perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  useEffect(() => {
    if (reduceMotion) {
      setLive(true);
      return;
    }
    const timer = window.setTimeout(() => setLive(true), 1800);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative mx-auto w-full max-w-[520px]"
    >
      <div className="absolute -left-6 top-8 h-40 w-40 rounded-full bg-brand-leaf-green/30 blur-[70px]" />
      <div className="absolute -right-4 bottom-6 h-44 w-44 rounded-full bg-brand-tangerine/20 blur-[80px]" />

      <motion.div
        style={reduceMotion ? undefined : { transform }}
        className="relative"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,28,46,0.22)]">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-leaf-green text-sm font-bold text-white">
                  M
                </span>
                <div>
                  <p className="text-sm font-bold text-[#1a2744]">Meridian Studio</p>
                  <p className="text-[11px] text-muted-foreground">modufy.app/meridian</p>
                </div>
              </div>
              <motion.span
                key={live ? "live" : "draft"}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                  live
                    ? "bg-brand-leaf-green/15 text-brand-leaf-green shadow-[0_0_24px_rgba(70,116,52,0.3)]"
                    : "bg-[#f4f1ea] text-[#6f6f6f]"
                }`}
              >
                {live ? "Live" : "Draft"}
              </motion.span>
            </div>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#eef4ea] via-[#faf8f5] to-[#fff4e8] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-leaf-green">
                Featured
              </p>
              <p className="mt-1 text-sm font-bold text-[#1a2744]">Shop products or book a service</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Guest checkout — no customer account required.
              </p>
            </div>

            <div className="space-y-2">
              {PRODUCTS.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#1a2744]">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{product.tag}</p>
                  </div>
                  <span className="text-sm font-bold text-brand-leaf-green">{product.price}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-[#f7f5f1] px-3 py-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#1a2744]">
                <Star className="h-3.5 w-3.5 text-brand-tangerine" />
                4.9 · 38 reviews
              </span>
              <span className="text-muted-foreground">15% weekend coupon live</span>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute -left-2 bottom-16 hidden w-[180px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl sm:block"
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
              <MessageSquare className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Enquiry
              </p>
              <p className="text-xs font-semibold text-[#1a2744]">New message</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -right-1 top-24 hidden w-[170px] rounded-2xl border border-white/80 bg-[#1a2744] p-3 text-white shadow-xl sm:block"
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-leaf-green/20 text-brand-leaf-green">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Order</p>
              <p className="text-xs font-semibold">{live ? "Linked to customer" : "Awaiting publish"}</p>
            </div>
          </div>
          {live && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-leaf-green"
            >
              <Check className="h-3.5 w-3.5" />
              Stock syncing
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
