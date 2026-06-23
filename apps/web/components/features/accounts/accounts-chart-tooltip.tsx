"use client";

import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type TooltipEntry = {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string;
  payload?: { net?: number; in?: number; out?: number };
};

type AccountsChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  currency: string;
  showDailyNet?: boolean;
};

export function AccountsChartTooltip({
  active,
  payload,
  label,
  currency,
  showDailyNet,
}: AccountsChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  const dailyNet =
    typeof row?.net === "number" ? row.net : (row?.in ?? 0) - (row?.out ?? 0);

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2.5 shadow-lg text-xs min-w-[10rem]">
      {label && <p className="font-semibold text-foreground mb-2">{label}</p>}
      <ul className="space-y-1.5">
        {payload.map((entry) => {
          const value = typeof entry.value === "number" ? entry.value : 0;
          const key = String(entry.dataKey ?? entry.name);
          const rowLabel =
            key === "in" || key === "revenue"
              ? "Revenue"
              : key === "out" || key === "expenses"
                ? "Expenses"
                : entry.name;
          return (
            <li key={String(entry.name ?? entry.dataKey)} className="flex justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                {entry.color && (
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                )}
                {rowLabel}
              </span>
              <span className="font-medium tabular-nums">{formatMoney(value, currency)}</span>
            </li>
          );
        })}
        {showDailyNet && (
          <li className="flex justify-between gap-4 border-t border-border/60 pt-1.5 mt-1">
            <span className="text-muted-foreground">Daily net</span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                dailyNet >= 0 ? "text-primary" : "text-destructive"
              )}
            >
              {formatMoney(dailyNet, currency)}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
