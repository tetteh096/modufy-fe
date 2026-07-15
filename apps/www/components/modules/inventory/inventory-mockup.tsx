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
import { AlertTriangle, Check, Package, ScanBarcode, Truck } from "lucide-react";

const ITEMS = [
  { name: "Clay conditioning bar", sku: "SKU-118", qty: "120", status: "In stock" },
  { name: "Shelf spray refill", sku: "SKU-204", qty: "18", status: "Low" },
  { name: "Studio consult", sku: "SVC-012", qty: "—", status: "Service" },
] as const;

export function InventoryMockup() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [alerted, setAlerted] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });
  const transform = useMotionTemplate`perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  useEffect(() => {
    if (reduceMotion) {
      setAlerted(true);
      return;
    }
    const timer = window.setTimeout(() => setAlerted(true), 1800);
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
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Catalog
              </p>
              <p className="mt-0.5 text-sm font-bold text-[#1a2744]">Inventory overview</p>
            </div>
            <span className="rounded-full bg-brand-leaf-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-leaf-green">
              Live stock
            </span>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["SKUs", "248"],
                ["Low stock", "6"],
                ["On order", "3"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-[#faf8f5] px-2 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1a2744]">{value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {ITEMS.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#1a2744]">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.sku} · qty {item.qty}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.status === "Low"
                        ? "bg-brand-tangerine/15 text-brand-tangerine"
                        : item.status === "Service"
                          ? "bg-[#1a2744]/8 text-[#1a2744]"
                          : "bg-brand-leaf-green/15 text-brand-leaf-green"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {alerted && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 rounded-xl border border-brand-tangerine/25 bg-brand-tangerine/10 px-3 py-2.5 text-xs text-brand-tangerine"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Low stock · create purchase order
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          className="absolute -left-2 bottom-16 hidden w-[180px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl sm:block"
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-leaf-green/15 text-brand-leaf-green">
              <ScanBarcode className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Scan
              </p>
              <p className="text-xs font-semibold text-[#1a2744]">Barcode ready</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -right-1 top-20 hidden w-[175px] rounded-2xl border border-white/80 bg-[#1a2744] p-3 text-white shadow-xl sm:block"
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-leaf-green/20 text-brand-leaf-green">
              <Truck className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">PO</p>
              <p className="text-xs font-semibold">Supplier synced</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-leaf-green">
            <Check className="h-3.5 w-3.5" />
            Stock movement logged
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/50">
            <Package className="h-3.5 w-3.5" />
            FIFO valuation
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
