"use client";

import { useId, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ACCOUNTS_CHART,
  accountsChartRows,
  cashYDomain,
  formatChartAxis,
  hasTrendActivity,
} from "@/lib/accounts-chart-utils";
import { rechartsAxisTick, rechartsLegendStyle } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";
import { AccountsChartTooltip } from "@/components/features/accounts/accounts-chart-tooltip";
import type { MonthlyTrend } from "@/types/api";

type AccountsRevenueExpensesChartProps = {
  months: MonthlyTrend[] | undefined;
  currency: string;
  className?: string;
  height?: number;
};

export function AccountsRevenueExpensesChart({
  months,
  currency,
  className,
  height = 300,
}: AccountsRevenueExpensesChartProps) {
  const uid = useId().replace(/:/g, "");
  const rows = useMemo(() => accountsChartRows(months), [months]);
  const yDomain = useMemo(() => cashYDomain(rows), [rows]);
  const hasData = hasTrendActivity(rows);

  if (rows.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground text-center py-16", className)}>
        Record sales and expenses to see revenue vs expenses.
      </p>
    );
  }

  return (
    <div className={cn("Modufy-chart", className)}>
      {!hasData ? (
        <p className="text-xs text-muted-foreground text-center py-10 mb-2">
          No revenue or expenses in this period yet.
        </p>
      ) : null}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={rows}
          margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          barCategoryGap="28%"
          barGap={6}
        >
          <defs>
            <linearGradient id={`${uid}-revenue`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCOUNTS_CHART.revenue} stopOpacity={0.95} />
              <stop offset="100%" stopColor={ACCOUNTS_CHART.revenue} stopOpacity={0.55} />
            </linearGradient>
            <linearGradient id={`${uid}-expense`} x1="0" y1="0" x2="0" y2="1">
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
            dataKey="month"
            tick={rechartsAxisTick}
            axisLine={false}
            tickLine={false}
            dy={6}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={rechartsAxisTick}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatChartAxis}
            domain={yDomain}
            width={48}
            allowDecimals={false}
          />
          <Tooltip content={<AccountsChartTooltip currency={currency} />} cursor={{ fill: "var(--muted)", opacity: 0.35 }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={rechartsLegendStyle} />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill={`url(#${uid}-revenue)`}
            radius={[5, 5, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill={`url(#${uid}-expense)`}
            radius={[5, 5, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
