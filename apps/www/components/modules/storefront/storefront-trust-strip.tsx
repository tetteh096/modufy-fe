"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const TRUST_ITEMS = [
  "Guest checkout",
  "Inventory-powered catalog",
  "Promotions & coupons",
  "Reviews & replies",
  "Orders linked to customers",
] as const;

export function StorefrontTrustStrip() {
  const reduceMotion = useReducedMotion();
  const loop = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <section className="border-y border-border bg-white">
      <div className="container-site py-5">
        <p className="text-center text-sm font-medium text-[#0e120e]/80">
          Built for businesses that outgrew Instagram DMs and still want something simple.
        </p>
      </div>
      <div className="border-t border-border/70 bg-[#f5f6f3]">
        <div className="relative overflow-hidden py-3.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f5f6f3] to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f5f6f3] to-transparent sm:w-24" />

          {reduceMotion ? (
            <div className="container-site flex flex-wrap justify-center gap-x-8 gap-y-2">
              {TRUST_ITEMS.map((item) => (
                <TrustLabel key={item} label={item} />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex w-max gap-10 px-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            >
              {loop.map((item, index) => (
                <TrustLabel key={`${item}-${index}`} label={item} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function TrustLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#0e120e]/75">
      <CheckCircle2 className="h-4 w-4 text-brand-leaf-green" />
      {label}
    </span>
  );
}
