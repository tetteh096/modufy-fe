"use client";

import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PnLReport } from "@/types/api";

type PnlKpiStripProps = {
  pnl: PnLReport;
  loading?: boolean;
};

export function PnlKpiStrip({ pnl, loading }: PnlKpiStripProps) {
  const { currency } = pnl;
  const items = [
    {
      label: "Revenue",
      value: formatMoney(pnl.revenue, currency),
      className: "text-primary",
    },
    {
      label: "Gross profit",
      value: formatMoney(pnl.gross_profit, currency),
      className: "text-foreground",
    },
    {
      label: "Expenses",
      value: formatMoney(pnl.expenses, currency),
      className: "text-destructive",
    },
    {
      label: "Net profit",
      value: formatMoney(pnl.net_profit, currency),
      className: pnl.net_profit >= 0 ? "text-primary" : "text-destructive",
    },
    {
      label: "Net margin",
      value: `${pnl.net_margin_pct.toFixed(1)}%`,
      className: pnl.net_margin_pct >= 0 ? "text-primary" : "text-destructive",
    },
  ];

  return (
    <div className="rounded-xl border border-primary/10 bg-primary/[0.04] dark:bg-primary/[0.07] overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            {loading ? (
              <div className="mt-2 mx-auto h-7 w-20 animate-pulse rounded bg-muted/50" />
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
