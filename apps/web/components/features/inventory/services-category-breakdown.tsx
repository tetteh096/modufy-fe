"use client";

import { formatMoney } from "@/lib/format";
import type { ServiceStatsResponse } from "@/types/api";

export function ServicesCategoryBreakdown({
  items,
  currency = "GHS",
}: {
  items: ServiceStatsResponse["by_category"];
  currency?: string;
}) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Group services by category when you create or edit them.
      </p>
    );
  }

  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.category} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium truncate">{item.category}</span>
            <span className="text-muted-foreground tabular-nums shrink-0 text-xs">
              {item.count} · avg {formatMoney(item.avg_price, currency)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500/70 dark:bg-emerald-400/60"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
