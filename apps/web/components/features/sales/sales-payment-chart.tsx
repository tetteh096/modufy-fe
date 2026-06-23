"use client";

import { formatMoney, formatPaymentMethod } from "@/lib/format";
import { paymentMethodMeta } from "@/lib/sales-constants";
import { cn } from "@/lib/utils";

type SalesPaymentChartProps = {
  byMethod: Record<string, number>;
  currency: string;
  className?: string;
};

export function SalesPaymentChart({
  byMethod,
  currency,
  className,
}: SalesPaymentChartProps) {
  const entries = Object.entries(byMethod)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  const max = Math.max(...entries.map(([, v]) => v), 1);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  if (entries.length === 0) {
    return (
      <p className={cn("text-xs text-muted-foreground text-center py-6", className)}>
        No payments recorded today yet.
      </p>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {entries.map(([method, amount]) => {
        const meta = paymentMethodMeta(method);
        const pct = (amount / max) * 100;
        const share = total > 0 ? Math.round((amount / total) * 100) : 0;
        return (
          <div key={method} className="space-y-1">
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="font-medium truncate">
                {meta?.label ?? formatPaymentMethod(method)}
              </span>
              <span className="text-muted-foreground tabular-nums shrink-0">
                {formatMoney(amount, currency)}
                <span className="ml-1 text-[10px]">({share}%)</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
