"use client";

import { formatMoney, formatExpenseCategory } from "@/lib/format";
import { expenseCategoryMeta } from "@/lib/expense-constants";
import { cn } from "@/lib/utils";
import { CircleDollarSign } from "lucide-react";

type ExpenseCategoryChartProps = {
  byCategory: Record<string, number>;
  currency: string;
  className?: string;
};

export function ExpenseCategoryChart({
  byCategory,
  currency,
  className,
}: ExpenseCategoryChartProps) {
  const entries = Object.entries(byCategory)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  const max = Math.max(...entries.map(([, v]) => v), 1);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  if (entries.length === 0) {
    return (
      <p className={cn("text-xs text-muted-foreground text-center py-6", className)}>
        No expenses logged today yet.
      </p>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {entries.map(([category, amount]) => {
        const meta = expenseCategoryMeta(category);
        const Icon = meta?.icon ?? CircleDollarSign;
        const pct = (amount / max) * 100;
        const share = total > 0 ? Math.round((amount / total) * 100) : 0;
        return (
          <div key={category} className="space-y-1">
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="font-medium flex items-center gap-1.5 truncate">
                <Icon className="h-3.5 w-3.5 shrink-0 text-orange-600 dark:text-orange-400" />
                {meta?.label ?? formatExpenseCategory(category)}
              </span>
              <span className="text-muted-foreground tabular-nums shrink-0">
                {formatMoney(amount, currency)}
                <span className="ml-1 text-[10px]">({share}%)</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500/70"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
