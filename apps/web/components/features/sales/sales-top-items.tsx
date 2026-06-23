"use client";

import { formatMoney } from "@/lib/format";
import type { SaleTopItem } from "@/types/api";

type SalesTopItemsProps = {
  items: SaleTopItem[];
  currency: string;
};

export function SalesTopItems({ items, currency }: SalesTopItemsProps) {
  if (!items.length) {
    return (
      <p className="text-xs text-muted-foreground text-center py-6">
        Top sellers appear here after you record sales today.
      </p>
    );
  }

  const max = Math.max(...items.map((i) => i.revenue), 1);

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={`${item.description}-${i}`} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium truncate">{item.description}</span>
            <span className="text-muted-foreground tabular-nums shrink-0 text-xs">
              {formatMoney(item.revenue, currency)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/70 dark:bg-primary/60"
              style={{ width: `${(item.revenue / max) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {item.quantity} sold
          </p>
        </li>
      ))}
    </ul>
  );
}
