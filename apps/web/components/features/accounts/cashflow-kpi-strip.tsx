"use client";

import { formatMoney, formatPaymentMethod } from "@/lib/format";
import { paymentMethodEntries } from "@/lib/cashflow-utils";
import { cn } from "@/lib/utils";

const METHOD_COLORS = [
  "hsl(132 42% 48%)",
  "hsl(220 12% 42%)",
  "hsl(38 80% 52%)",
  "hsl(262 45% 55%)",
  "hsl(199 55% 48%)",
];

type CashFlowKpiStripProps = {
  totalIn: number;
  totalOut: number;
  closingBalance: number;
  currency: string;
  loading?: boolean;
};

export function CashFlowKpiStrip({
  totalIn,
  totalOut,
  closingBalance,
  currency,
  loading,
}: CashFlowKpiStripProps) {
  const netMovement = totalIn - totalOut;
  const items = [
    { label: "Cash in", value: formatMoney(totalIn, currency), className: "text-primary" },
    { label: "Cash out", value: formatMoney(totalOut, currency), className: "text-destructive" },
    {
      label: "Net movement",
      value: formatMoney(netMovement, currency),
      className: netMovement >= 0 ? "text-primary" : "text-destructive",
    },
    {
      label: "Closing balance",
      value: formatMoney(closingBalance, currency),
      className: closingBalance >= 0 ? "text-foreground" : "text-destructive",
    },
  ];

  return (
    <div className="rounded-xl border border-primary/10 bg-primary/[0.04] dark:bg-primary/[0.07] overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            {loading ? (
              <div className="mt-2 mx-auto h-7 w-24 animate-pulse rounded bg-muted/50" />
            ) : (
              <p className={cn("mt-1.5 text-lg font-bold tabular-nums tracking-tight", item.className)}>
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type CashFlowPaymentBreakdownProps = {
  byMethod: Record<string, number>;
  currency: string;
};

export function CashFlowPaymentBreakdown({ byMethod, currency }: CashFlowPaymentBreakdownProps) {
  const entries = paymentMethodEntries(byMethod);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        No cash-in by payment method in this period.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {entries.map((row, i) => (
        <li key={row.method}>
          <div className="flex items-center justify-between gap-2 text-sm mb-1.5">
            <span className="font-medium truncate">{formatPaymentMethod(row.method)}</span>
            <span className="tabular-nums shrink-0">{formatMoney(row.amount, currency)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(row.pct, row.amount > 0 ? 4 : 0)}%`,
                backgroundColor: METHOD_COLORS[i % METHOD_COLORS.length],
              }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
            {row.pct.toFixed(1)}% of cash in
          </p>
        </li>
      ))}
    </ul>
  );
}
