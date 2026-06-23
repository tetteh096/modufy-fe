"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight, Minus } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { cashInClass, cashOutClass, cashOutBarClass } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardCashPositionProps = {
  currency: string;
  periodLabel: string;
  revenue: number;
  expenses: number;
  net: number;
  saleCount: number;
  loading?: boolean;
};

export function DashboardCashPosition({
  currency,
  periodLabel,
  revenue,
  expenses,
  net,
  saleCount,
  loading,
}: DashboardCashPositionProps) {
  const total = Math.max(revenue + expenses, 1);
  const revenuePct = (revenue / total) * 100;
  const expensePct = (expenses / total) * 100;
  const isPositive = net >= 0;
  const periodLower = periodLabel.toLowerCase();

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-3 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Net position · {periodLabel}
          </p>
          <p
            className={cn(
              "text-3xl md:text-4xl font-bold tracking-tight tabular-nums",
              isPositive ? cashInClass : cashOutClass
            )}
          >
            {formatMoney(net, currency)}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
            ) : net < 0 ? (
              <TrendingDown className={cn("h-3.5 w-3.5 shrink-0", cashOutClass)} />
            ) : (
              <Minus className="h-3.5 w-3.5 shrink-0" />
            )}
            {saleCount > 0
              ? `${saleCount} sale${saleCount !== 1 ? "s" : ""} in ${periodLower}`
              : `No sales in ${periodLower}`}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Link
            href="/sales"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            Sales <ArrowRight className="h-3 w-3" />
          </Link>
          <span className="text-muted-foreground/40">·</span>
          <Link
            href="/expenses"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            Expenses <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="mt-6 h-2.5 rounded-full bg-muted overflow-hidden flex">
        {revenue > 0 && (
          <div
            className="bg-primary h-full transition-all"
            style={{ width: `${revenuePct}%` }}
            title={`Revenue: ${formatMoney(revenue, currency)}`}
          />
        )}
        {expenses > 0 && (
          <div
            className={cn(cashOutBarClass, "h-full transition-all")}
            style={{ width: `${expensePct}%` }}
            title={`Expenses: ${formatMoney(expenses, currency)}`}
          />
        )}
        {revenue === 0 && expenses === 0 && (
          <div className="w-full bg-muted-foreground/15" />
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            Cash in · {periodLabel}
          </p>
          <p className="text-base font-semibold tabular-nums text-primary mt-0.5">
            {formatMoney(revenue, currency)}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            Cash out · {periodLabel}
          </p>
          <p className={cn("text-base font-semibold tabular-nums mt-0.5", cashOutClass)}>
            {formatMoney(expenses, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
