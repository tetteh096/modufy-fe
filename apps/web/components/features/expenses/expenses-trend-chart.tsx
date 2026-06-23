"use client";

import { trendChartDayLabel, trendChartDayTitle } from "@/lib/dashboard-chart-data";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ExpenseTrendDay } from "@/types/api";

const CHART_HEIGHT = 120;

type ExpensesTrendChartProps = {
  data: ExpenseTrendDay[];
  currency: string;
  className?: string;
};

export function ExpensesTrendChart({ data, currency, className }: ExpensesTrendChartProps) {
  const dayCount = data.length;
  const max = Math.max(...data.map((d) => d.total), 1);
  const hasAny = data.some((d) => d.total > 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="flex items-end justify-between gap-1.5 sm:gap-2"
        style={{ height: CHART_HEIGHT + 28 }}
      >
        {data.map((day, index) => {
          const barPx =
            day.total > 0 ? Math.max(6, Math.round((day.total / max) * CHART_HEIGHT)) : 3;
          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center justify-end gap-1 min-w-0 h-full"
            >
              {day.total > 0 && (
                <span className="text-[9px] sm:text-[10px] text-muted-foreground tabular-nums truncate max-w-full text-center leading-none">
                  {formatMoney(day.total, currency).replace(/\s/g, "\u00a0")}
                </span>
              )}
              <div
                className={cn(
                  "w-full max-w-[44px] rounded-t-md transition-colors",
                  day.total > 0
                    ? "bg-orange-500 hover:bg-orange-500/90"
                    : "bg-muted/80"
                )}
                style={{ height: barPx }}
                title={`${trendChartDayTitle(day.date)}: ${formatMoney(day.total, currency)}`}
              />
              <span className="text-[10px] text-muted-foreground truncate w-full text-center min-h-[14px]">
                {trendChartDayLabel(day.date, dayCount, index)}
              </span>
            </div>
          );
        })}
      </div>
      {!hasAny && (
        <p className="text-xs text-muted-foreground text-center py-1">
          No spending in the last {data.length} days — log an expense to see trends.
        </p>
      )}
    </div>
  );
}
