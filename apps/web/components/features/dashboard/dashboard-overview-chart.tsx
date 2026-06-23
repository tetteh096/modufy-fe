"use client";

import { useId, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatMoney } from "@/lib/format";
import { chartRangeTotals, mergeTrendDays } from "@/lib/dashboard-chart-data";
import {
  rechartsAxisTick,
  rechartsLegendStyle,
} from "@/lib/chart-colors";
import { cn } from "@/lib/utils";
import type { ExpenseTrendDay, SalesTrendDay } from "@/types/api";

const CASH_IN = "hsl(148 35% 42%)";
const CASH_OUT = "hsl(0 45% 58%)";
const BALANCE = "hsl(148 40% 38%)";

type DashboardOverviewChartProps = {
  revenue: SalesTrendDay[];
  spending: ExpenseTrendDay[];
  chartFrom: string;
  chartTo: string;
  currency: string;
  chartSubtitle: string;
  className?: string;
};

function OverviewTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string; payload?: unknown }>;
  label?: string;
  currency: string;
}) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload as {
    date?: string;
    in?: number;
    out?: number;
    net?: number;
    cumulative?: number;
  };

  const title = row?.date
    ? new Date(row.date + "T12:00:00").toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : label;

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2.5 shadow-lg text-xs min-w-[10rem]">
      <p className="font-semibold text-foreground mb-2">{title}</p>
      <ul className="space-y-1.5">
        {payload.map((entry) => {
          const v = typeof entry.value === "number" ? entry.value : 0;
          if (entry.dataKey === "cumulative") {
            return (
              <li key={String(entry.dataKey)} className="flex justify-between gap-4">
                <span className="text-muted-foreground">Running net</span>
                <span className="font-medium tabular-nums">{formatMoney(v, currency)}</span>
              </li>
            );
          }
          return (
            <li key={String(entry.name)} className="flex justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-medium tabular-nums">{formatMoney(v, currency)}</span>
            </li>
          );
        })}
        {row?.net !== undefined && (
          <li className="flex justify-between gap-4 border-t border-border/60 pt-1.5 mt-1">
            <span className="text-muted-foreground">Daily net</span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                row.net >= 0 ? "text-primary" : "text-destructive"
              )}
            >
              {formatMoney(row.net, currency)}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}

export function DashboardOverviewChart({
  revenue,
  spending,
  chartFrom,
  chartTo,
  currency,
  chartSubtitle,
  className,
}: DashboardOverviewChartProps) {
  const uid = useId().replace(/:/g, "");
  const data = useMemo(
    () => mergeTrendDays(revenue, spending, chartFrom, chartTo),
    [revenue, spending, chartFrom, chartTo]
  );

  const totals = useMemo(
    () => chartRangeTotals(revenue, spending, chartFrom, chartTo),
    [revenue, spending, chartFrom, chartTo]
  );

  const hasAny = data.some((d) => d.in > 0 || d.out > 0);
  const maxCash = Math.max(...data.map((d) => Math.max(d.in, d.out)), 1);
  const cumValues = data.map((d) => d.cumulative);
  const minCum = Math.min(...cumValues, 0);
  const maxCum = Math.max(...cumValues, 1);

  const fmt = (v: number) => formatMoney(v, currency);
  const fmtAxis = (v: number) =>
    Math.abs(v) >= 1000
      ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
      : String(Math.round(v));

  if (data.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground text-center py-16", className)}>
        Record sales and expenses to see your overview chart.
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
        {[
          { label: "Cash in", value: fmt(totals.revenue), className: "text-primary" },
          { label: "Cash out", value: fmt(totals.expenses), className: "text-destructive" },
          {
            label: "Net",
            value: fmt(totals.net),
            className: totals.net >= 0 ? "text-primary" : "text-destructive",
          },
          { label: "Sales", value: String(totals.saleCount), className: "text-foreground" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-muted/25 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {kpi.label}
            </p>
            <p className={cn("mt-1 text-sm font-bold tabular-nums sm:text-base", kpi.className)}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-center text-muted-foreground -mt-1">
        Totals for {chartSubtitle.toLowerCase()}
      </p>

      {!hasAny ? (
        <p className="text-xs text-muted-foreground text-center py-10">
          No cash movement in this window yet.
        </p>
      ) : (
        <div className="bizos-chart">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
            data={data}
            margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
            barCategoryGap="28%"
            barGap={6}
          >
            <defs>
              <linearGradient id={`${uid}-in`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CASH_IN} stopOpacity={0.95} />
                <stop offset="100%" stopColor={CASH_IN} stopOpacity={0.25} />
              </linearGradient>
              <linearGradient id={`${uid}-out`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CASH_OUT} stopOpacity={0.9} />
                <stop offset="100%" stopColor={CASH_OUT} stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id={`${uid}-balance`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BALANCE} stopOpacity={0.22} />
                <stop offset="100%" stopColor={BALANCE} stopOpacity={0.02} />
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
            />
            <YAxis
              yAxisId="cash"
              tick={rechartsAxisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={fmtAxis}
              domain={[0, Math.ceil(maxCash * 1.15)]}
              width={44}
            />
            <YAxis
              yAxisId="balance"
              orientation="right"
              tick={rechartsAxisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={fmtAxis}
              domain={[Math.floor(minCum * 1.1), Math.ceil(maxCum * 1.1)]}
              width={44}
            />
            <Tooltip
              content={<OverviewTooltip currency={currency} />}
              cursor={{ fill: "var(--muted)", opacity: 0.35 }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={rechartsLegendStyle}
            />
            <Bar
              yAxisId="cash"
              dataKey="in"
              name="Cash in"
              fill={`url(#${uid}-in)`}
              radius={[5, 5, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              yAxisId="cash"
              dataKey="out"
              name="Cash out"
              fill={`url(#${uid}-out)`}
              radius={[5, 5, 0, 0]}
              maxBarSize={22}
            />
            <Area
              yAxisId="balance"
              type="monotone"
              dataKey="cumulative"
              name="Running net"
              fill={`url(#${uid}-balance)`}
              stroke={BALANCE}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: BALANCE }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
