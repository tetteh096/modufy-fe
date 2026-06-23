"use client";

import { useId } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ACCOUNTS_CHART, formatChartAxis } from "@/lib/accounts-chart-utils";
import { rechartsAxisTick } from "@/lib/chart-colors";
import { CashFlowChartTooltip } from "@/components/features/accounts/cashflow-chart-tooltip";
import type { CashFlowChartPoint } from "@/lib/cashflow-utils";
import { cn } from "@/lib/utils";

type CashFlowDailyChartProps = {
  data: CashFlowChartPoint[];
  currency: string;
  height?: number;
  className?: string;
};

export function CashFlowDailyChart({
  data,
  currency,
  height = 320,
  className,
}: CashFlowDailyChartProps) {
  const uid = useId().replace(/:/g, "");
  const hasAny = data.some((d) => d.in > 0 || d.out > 0);
  const maxVal = Math.max(...data.map((d) => Math.max(d.in, d.out)), 1);

  if (data.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground text-center py-16", className)}>
        No cash movement in this period.
      </p>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {!hasAny ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No transactions in this period yet.
        </p>
      ) : null}

      <div className="bizos-chart">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
            barCategoryGap="28%"
            barGap={6}
          >
            <defs>
              <linearGradient id={`${uid}-in`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCOUNTS_CHART.revenue} stopOpacity={0.95} />
                <stop offset="100%" stopColor={ACCOUNTS_CHART.revenue} stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id={`${uid}-out`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCOUNTS_CHART.expense} stopOpacity={0.9} />
                <stop offset="100%" stopColor={ACCOUNTS_CHART.expense} stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--border)"
              strokeOpacity={0.55}
            />
            <XAxis
              dataKey="label"
              tick={rechartsAxisTick}
              axisLine={false}
              tickLine={false}
              dy={6}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis
              tick={rechartsAxisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatChartAxis}
              domain={[0, Math.ceil(maxVal * 1.12)]}
              width={52}
              allowDecimals={false}
            />
            <Tooltip
              content={<CashFlowChartTooltip currency={currency} />}
              cursor={{ fill: "var(--muted)", opacity: 0.35 }}
            />
            <Bar
              dataKey="in"
              name="Cash in"
              fill={`url(#${uid}-in)`}
              radius={[5, 5, 0, 0]}
              maxBarSize={data.length > 20 ? 14 : 26}
            />
            <Bar
              dataKey="out"
              name="Cash out"
              fill={`url(#${uid}-out)`}
              radius={[5, 5, 0, 0]}
              maxBarSize={data.length > 20 ? 14 : 26}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: ACCOUNTS_CHART.revenue }}
          />
          Cash in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: ACCOUNTS_CHART.expense }}
          />
          Cash out
        </span>
        <span className="text-[11px]">Hover for daily net and running balance</span>
      </div>
    </div>
  );
}
