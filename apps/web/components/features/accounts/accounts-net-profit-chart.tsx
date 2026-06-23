"use client";

import { useId, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ACCOUNTS_CHART,
  accountsChartRows,
  formatChartAxis,
  hasTrendActivity,
  netYDomain,
} from "@/lib/accounts-chart-utils";
import { rechartsAxisTick } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";
import { AccountsChartTooltip } from "@/components/features/accounts/accounts-chart-tooltip";
import type { MonthlyTrend } from "@/types/api";

type AccountsNetProfitChartProps = {
  months: MonthlyTrend[] | undefined;
  currency: string;
  className?: string;
  height?: number;
};

export function AccountsNetProfitChart({
  months,
  currency,
  className,
  height = 300,
}: AccountsNetProfitChartProps) {
  const uid = useId().replace(/:/g, "");
  const rows = useMemo(() => accountsChartRows(months), [months]);
  const yDomain = useMemo(() => netYDomain(rows), [rows]);
  const hasData = hasTrendActivity(rows);

  if (rows.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground text-center py-16", className)}>
        Net profit trend appears once you have revenue or expenses.
      </p>
    );
  }

  return (
    <div className={cn("bizos-chart", className)}>
      {!hasData ? (
        <p className="text-xs text-muted-foreground text-center py-10 mb-2">
          No profit movement in this period yet.
        </p>
      ) : null}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id={`${uid}-net`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCOUNTS_CHART.net} stopOpacity={0.35} />
              <stop offset="95%" stopColor={ACCOUNTS_CHART.net} stopOpacity={0.02} />
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
          />
          <Tooltip content={<AccountsChartTooltip currency={currency} />} />
          <Area
            type="monotone"
            dataKey="net"
            name="Net profit"
            stroke={ACCOUNTS_CHART.net}
            strokeWidth={2.5}
            fill={`url(#${uid}-net)`}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: ACCOUNTS_CHART.net }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
