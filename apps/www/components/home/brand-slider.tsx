"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  BadgeCheck,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

const TRUST_BADGES = [
  { label: "Built for growing teams", icon: Users },
  { label: "Ghana tax ready", icon: BadgeCheck },
  { label: "MoMo & card payments", icon: CreditCard },
  { label: "Secure & encrypted", icon: Lock },
  { label: "Works on mobile", icon: Smartphone },
  { label: "One customer book", icon: ShieldCheck },
] as const;

export function BrandSlider() {
  const reduceMotion = useReducedMotion();
  const loop = [...TRUST_BADGES, ...TRUST_BADGES];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-[#fbf9f4] py-5">
      <div className="texture-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-site relative">
        <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-brand-sea-grey/45 sm:mb-5">
          Why teams choose Modufy
        </p>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#fbf9f4] to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#fbf9f4] to-transparent sm:w-20" />

          {reduceMotion ? (
            <div className="flex flex-wrap justify-center gap-3 px-2">
              {TRUST_BADGES.map((badge) => (
                <TrustBadge key={badge.label} {...badge} />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex w-max gap-3 px-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 32, ease: "linear", repeat: Infinity }}
            >
              {loop.map((badge, index) => (
                <TrustBadge key={`${badge.label}-${index}`} {...badge} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function TrustBadge({
  label,
  icon: Icon,
}: {
  label: string;
  icon: (typeof TRUST_BADGES)[number]["icon"];
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-brand-sea-grey/10 bg-white/70 px-4 py-2 text-sm font-semibold text-brand-sea-grey/80 shadow-[0_2px_10px_rgba(54,54,54,0.04)] backdrop-blur-[2px]">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-leaf-green/10 text-brand-leaf-green">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      </span>
      {label}
    </span>
  );
}
