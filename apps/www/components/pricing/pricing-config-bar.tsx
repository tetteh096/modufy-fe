"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BillingCycle, Currency } from "@/lib/pricing-content";

const currencies: Currency[] = ["EUR", "USD", "GBP"];

const billingOptions: { id: BillingCycle; label: string; badge?: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly", badge: "-50%" },
];

function ControlLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        "mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]",
        dark ? "text-white/70" : "text-muted-foreground"
      )}
    >
      {children}
    </p>
  );
}

function SegmentedOption({
  active,
  label,
  badge,
  onClick,
  dark,
}: {
  active: boolean;
  label: string;
  badge?: string;
  onClick: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        dark
          ? active
            ? "bg-white text-brand-sea-grey shadow-sm"
            : "text-white/85 hover:bg-white/10"
          : active
            ? "bg-brand-sea-grey text-white shadow-sm"
            : "text-brand-sea-grey hover:bg-muted"
      )}
    >
      {label}
      {badge ? (
        <span className="ml-1.5 rounded-full bg-brand-tangerine px-1.5 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

type PricingConfigBarProps = {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  teamSize: number;
  onTeamSizeChange: (size: number) => void;
  billing: BillingCycle;
  onBillingChange: (billing: BillingCycle) => void;
  variant?: "dark" | "light";
  className?: string;
};

export function PricingConfigBar({
  currency,
  onCurrencyChange,
  teamSize,
  onTeamSizeChange,
  billing,
  onBillingChange,
  variant = "dark",
  className,
}: PricingConfigBarProps) {
  const dark = variant === "dark";

  return (
    <div
      className={cn(
        "w-full rounded-[2rem] border p-2 backdrop-blur-2xl",
        dark
          ? "border-white/25 bg-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          : "border-border bg-card shadow-lg",
        className
      )}
    >
      <div
        className={cn(
          "grid gap-2 md:grid-cols-3 md:gap-0",
          dark ? "md:divide-x md:divide-white/15" : "md:divide-x md:divide-border"
        )}
      >
        <div className="px-3 py-3 md:px-5">
          <ControlLabel dark={dark}>Price in</ControlLabel>
          <div className={cn("inline-flex rounded-full p-1", dark ? "bg-black/20" : "bg-muted")}>
            {currencies.map((option) => (
              <SegmentedOption
                key={option}
                dark={dark}
                active={currency === option}
                label={option}
                onClick={() => onCurrencyChange(option)}
              />
            ))}
          </div>
        </div>

        <div className="px-3 py-3 md:px-5">
          <ControlLabel dark={dark}>Team members</ControlLabel>
          <div className={cn("inline-flex items-center gap-1 rounded-full p-1", dark ? "bg-black/20" : "bg-muted")}>
            <button
              type="button"
              aria-label="Decrease team size"
              onClick={() => onTeamSizeChange(Math.max(1, teamSize - 1))}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition",
                dark ? "text-white/90 hover:bg-white/10" : "text-brand-sea-grey hover:bg-background"
              )}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span
              className={cn(
                "flex h-9 min-w-[2.75rem] items-center justify-center rounded-full px-4 text-sm font-bold",
                dark ? "bg-white text-brand-sea-grey" : "bg-background text-brand-sea-grey shadow-sm"
              )}
            >
              {teamSize}
            </span>
            <button
              type="button"
              aria-label="Increase team size"
              onClick={() => onTeamSizeChange(Math.min(50, teamSize + 1))}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition",
                dark ? "text-white/90 hover:bg-white/10" : "text-brand-sea-grey hover:bg-background"
              )}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-3 py-3 md:px-5">
          <ControlLabel dark={dark}>Billing cycle</ControlLabel>
          <div className={cn("inline-flex flex-wrap rounded-full p-1", dark ? "bg-black/20" : "bg-muted")}>
            {billingOptions.map((option) => (
              <SegmentedOption
                key={option.id}
                dark={dark}
                active={billing === option.id}
                label={option.label}
                badge={option.badge}
                onClick={() => onBillingChange(option.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
