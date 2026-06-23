"use client";

import { trendChartDayLabel, trendChartDayTitle, eachDayInRange } from "@/lib/dashboard-chart-data";
import { formatMoney } from "@/lib/format";
import {
  cashInBarClass,
  cashOutBarClass,
  cashOutLegendClass,
} from "@/lib/chart-colors";
import { cn } from "@/lib/utils";
import type { ExpenseTrendDay, SalesTrendDay } from "@/types/api";

const CHART_HEIGHT = 128;
const MIN_BAR = 4;

function mergeDays(
  revenue: SalesTrendDay[],
  spending: ExpenseTrendDay[],
  from: string,
  to: string
): { date: string; in: number; out: number }[] {
  const revMap = new Map(revenue.map((d) => [d.date, d.total]));
  const spendMap = new Map(spending.map((d) => [d.date, d.total]));
  return eachDayInRange(from, to).map((date) => ({
    date,
    in: revMap.get(date) ?? 0,
    out: spendMap.get(date) ?? 0,
  }));
}

type DashboardCashFlowChartProps = {
  revenue: SalesTrendDay[];
  spending: ExpenseTrendDay[];
  chartFrom: string;
  chartTo: string;
  currency: string;
  className?: string;
};

export function DashboardCashFlowChart({
  revenue,
  spending,
  chartFrom,
  chartTo,
  currency,
  className,
}: DashboardCashFlowChartProps) {
  const days = mergeDays(revenue, spending, chartFrom, chartTo);
  /** One scale so GH₵50 out is visibly shorter than GH₵300 in */
  const max = Math.max(...days.map((d) => Math.max(d.in, d.out)), 1);
  const hasAny = days.some((d) => d.in > 0 || d.out > 0);

  if (days.length === 0) {
    return (
      <p className={cn("text-xs text-muted-foreground text-center py-10", className)}>
        Record sales and expenses to see your cash flow trend.
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-4 text-xs text-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-sm shadow-sm", cashInBarClass)} />
          Cash in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-sm shadow-sm", cashOutLegendClass)} />
          Cash out
        </span>
      </div>

      <div
        className="flex items-end justify-between gap-1 sm:gap-2"
        style={{ height: CHART_HEIGHT + 32 }}
      >
        {days.map((day, index) => {
          const inPx =
            day.in > 0
              ? Math.max(MIN_BAR, Math.round((day.in / max) * CHART_HEIGHT))
              : 2;
          const outPx =
            day.out > 0
              ? Math.max(MIN_BAR, Math.round((day.out / max) * CHART_HEIGHT))
              : 2;
          const title = trendChartDayTitle(day.date);
          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center justify-end gap-1 min-w-0 h-full"
            >
              <div className="flex items-end justify-center gap-0.5 sm:gap-1 h-full w-full max-w-[52px]">
                <div
                  className={cn(
                    "w-[42%] max-w-[18px] rounded-t-md shadow-sm transition-colors",
                    cashInBarClass
                  )}
                  style={{ height: inPx }}
                  title={`${title} · In: ${formatMoney(day.in, currency)}`}
                />
                <div
                  className={cn(
                    "w-[42%] max-w-[18px] rounded-t-md shadow-sm transition-colors",
                    cashOutBarClass
                  )}
                  style={{ height: outPx }}
                  title={`${title} · Out: ${formatMoney(day.out, currency)}`}
                />
              </div>
              <span className="text-[10px] text-muted-foreground truncate w-full text-center min-h-[14px]">
                {trendChartDayLabel(day.date, days.length, index)}
              </span>
            </div>
          );
        })}
      </div>

      {!hasAny && (
        <p className="text-xs text-muted-foreground text-center">
          No movement in this period yet.
        </p>
      )}
    </div>
  );
}
