"use client";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const currencies = ["EUR", "USD", "GBP"] as const;
type Currency = (typeof currencies)[number];

const billingOptions = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly", badge: "-50%" },
  { id: "biyearly", label: "Bi-Yearly" },
] as const;
type Billing = (typeof billingOptions)[number]["id"];

function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">{children}</p>
  );
}

function SegmentedOption({
  active,
  label,
  badge,
  onClick,
  layoutId,
}: {
  active: boolean;
  label: string;
  badge?: string;
  onClick: () => void;
  layoutId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200 focus:outline-none sm:px-4 sm:py-2 sm:text-sm",
        active ? "text-brand-sea-grey" : "text-white/85 hover:bg-white/10"
      )}
    >
      {active && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 rounded-full bg-white shadow-sm"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
      {badge ? (
        <span className="relative z-10 ml-1 rounded-full bg-brand-tangerine px-1.5 py-0.5 text-[9px] font-bold text-white sm:ml-1.5 sm:text-[10px]">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export function HeroConfigBar() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [teamSize, setTeamSize] = useState(1);
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <div className="w-full max-w-4xl rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.3)] hover:border-white/30 hover:shadow-[0_24px_60px_rgba(245,143,32,0.15)] transition-all duration-500 backdrop-blur-2xl backdrop-saturate-150">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 md:divide-x md:divide-white/15">
        <div className="px-3 py-3 md:px-5 shrink-0">
          <ControlLabel>Price in</ControlLabel>
          <div className="inline-flex rounded-full bg-black/25 p-1">
            {currencies.map((option) => (
              <SegmentedOption
                key={option}
                active={currency === option}
                label={option}
                layoutId="currency-pill"
                onClick={() => setCurrency(option)}
              />
            ))}
          </div>
        </div>

        <div className="px-3 py-3 md:px-5 shrink-0">
          <ControlLabel>Team members</ControlLabel>
          <div className="inline-flex items-center gap-1 rounded-full bg-black/25 p-1">
            <button
              type="button"
              aria-label="Decrease team size"
              onClick={() => setTeamSize((value) => Math.max(1, value - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 active:scale-90"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex h-9 min-w-[2.75rem] items-center justify-center rounded-full bg-white text-sm font-bold text-brand-sea-grey overflow-hidden px-1">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={teamSize}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="inline-block"
                >
                  {teamSize}
                </motion.span>
              </AnimatePresence>
            </span>
            <button
              type="button"
              aria-label="Increase team size"
              onClick={() => setTeamSize((value) => Math.min(99, value + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 active:scale-90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-3 py-3 md:px-5 flex-1 min-w-0">
          <ControlLabel>Billing cycle</ControlLabel>
          <div className="inline-flex rounded-full bg-black/25 p-1">
            {billingOptions.map((option) => (
              <SegmentedOption
                key={option.id}
                active={billing === option.id}
                label={option.label}
                badge={"badge" in option ? option.badge : undefined}
                layoutId="billing-pill"
                onClick={() => setBilling(option.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
