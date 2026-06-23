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
import {
  ACCOUNTS_CHART,
  formatChartAxis,
  type AccountsChartPoint,
} from "@/lib/accounts-chart-utils";
import { rechartsAxisTick } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";
import { AccountsChartTooltip } from "@/components/features/accounts/accounts-chart-tooltip";
import { formatMoney } from "@/lib/format";

type AccountsComposedChartProps = {
  data: AccountsChartPoint[];
  currency: string;
  height?: number;
  className?: string;
};

export function AccountsComposedChart({
  data,
  currency,
  height = 320,
  className,
}: AccountsComposedChartProps) {
  const uid = useId().replace(/:/g, "");

  const hasAny = data.some((d) => d.in > 0 || d.out > 0);
  const maxVal = Math.max(...data.map((d) => Math.max(d.in, d.out)), 1);

  if (data.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground text-center py-16", className)}>
        Record sales and expenses to see your financial overview.
      </p>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {!hasAny ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No revenue or expenses in this period yet.
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
              <linearGradient id={`${uid}-rev`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCOUNTS_CHART.revenue} stopOpacity={0.95} />
                <stop offset="100%" stopColor={ACCOUNTS_CHART.revenue} stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id={`${uid}-exp`} x1="0" y1="0" x2="0" y2="1">
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
              content={<AccountsChartTooltip currency={currency} showDailyNet />}
              cursor={{ fill: "var(--muted)", opacity: 0.35 }}
            />
            <Bar
              dataKey="in"
              name="Revenue"
              fill={`url(#${uid}-rev)`}
              radius={[5, 5, 0, 0]}
              maxBarSize={data.length > 20 ? 14 : 26}
            />
            <Bar
              dataKey="out"
              name="Expenses"
              fill={`url(#${uid}-exp)`}
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
          Revenue
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: ACCOUNTS_CHART.expense }}
          />
          Expenses
        </span>
        <span className="text-[11px]">
          Net for each day in the tooltip · totals above
        </span>
      </div>
    </div>
  );
}

export type AccountsKpiStripProps = {
  revenue: number;
  expenses: number;
  net: number;
  tax: number;
  marginPct: number;
  currency: string;
  loading?: boolean;
};

export function AccountsKpiStrip({
  revenue,
  expenses,
  net,
  tax,
  marginPct,
  currency,
  loading,
}: AccountsKpiStripProps) {
  const items = [
    {
      label: "Revenue",
      value: formatMoney(revenue, currency),
      className: "text-primary",
    },
    {
      label: "Expenses",
      value: formatMoney(expenses, currency),
      className: "text-destructive",
    },
    {
      label: "Net profit",
      value: formatMoney(net, currency),
      className: net >= 0 ? "text-primary" : "text-destructive",
    },
    {
      label: "Tax liability",
      value: formatMoney(tax, currency),
      className: "text-foreground",
    },
    {
      label: "Margin",
      value: `${marginPct.toFixed(1)}%`,
      className: marginPct >= 0 ? "text-primary" : "text-destructive",
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
