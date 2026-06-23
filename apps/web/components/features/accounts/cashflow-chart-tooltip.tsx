"use client";

import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type CashFlowChartTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
    dataKey?: string;
    payload?: { net?: number; in?: number; out?: number; running?: number; label?: string; date?: string };
  }>;
  label?: string;
  currency: string;
};

export function CashFlowChartTooltip({
  active,
  payload,
  label,
  currency,
}: CashFlowChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  const dailyNet =
    typeof row?.net === "number" ? row.net : (row?.in ?? 0) - (row?.out ?? 0);
  const running = row?.running ?? 0;

  const title =
    row?.date
      ? new Date(row.date + "T12:00:00").toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : label;

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2.5 shadow-lg text-xs min-w-[11rem]">
      {title && <p className="font-semibold text-foreground mb-2">{title}</p>}
      <ul className="space-y-1.5">
        {payload.map((entry) => {
          const value = typeof entry.value === "number" ? entry.value : 0;
          const key = String(entry.dataKey ?? entry.name);
          const rowLabel = key === "in" ? "Cash in" : key === "out" ? "Cash out" : entry.name;
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
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">Running balance</span>
          <span
            className={cn(
              "font-medium tabular-nums",
              running >= 0 ? "text-foreground" : "text-destructive"
            )}
          >
            {formatMoney(running, currency)}
          </span>
        </li>
      </ul>
    </div>
  );
}
