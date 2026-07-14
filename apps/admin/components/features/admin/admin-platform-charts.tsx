"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_PRIMARY, CHART_SECONDARY, rechartsAxisTick } from "@/lib/chart-colors";
import { formatCompact, formatMoney } from "@/lib/format";
import type { DashboardTrendDay } from "@/types/admin";

function chartDayLabel(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function chartDayTitle(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function GmvTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: { date?: string; value?: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row?.date) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{chartDayTitle(row.date)}</p>
      <p className="mt-1 tabular-nums text-muted-foreground">
        {formatMoney(row.value ?? 0)}
      </p>
    </div>
  );
}

function SignupsTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: { date?: string; value?: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row?.date) return null;
  const count = row.value ?? 0;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{chartDayTitle(row.date)}</p>
      <p className="mt-1 text-muted-foreground">
        {count} signup{count === 1 ? "" : "s"}
      </p>
    </div>
  );
}

type AdminPlatformChartsProps = {
  gmvTrend: DashboardTrendDay[];
  signupsTrend: DashboardTrendDay[];
};

export function AdminPlatformCharts({ gmvTrend, signupsTrend }: AdminPlatformChartsProps) {
  const gmvGradientId = useId();
  const hasGmv = gmvTrend.some((d) => d.value > 0);
  const hasSignups = signupsTrend.some((d) => d.value > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.03] to-card lg:col-span-3 shadow-sm">
        <div className="border-b border-primary/10 bg-primary/[0.04] px-5 py-4">
          <h3 className="text-sm font-semibold text-primary">Merchant GMV</h3>
          <p className="text-xs text-muted-foreground">Completed sales across all tenants · last 30 days</p>
        </div>
        <div className="h-64 px-2 py-4 sm:px-4">
          {!hasGmv ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No sales recorded in this period yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gmvGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={rechartsAxisTick}
                  tickFormatter={chartDayLabel}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={28}
                />
                <YAxis
                  tick={rechartsAxisTick}
                  tickFormatter={(v) => formatCompact(Number(v))}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                />
                <Tooltip content={<GmvTooltip />} cursor={{ stroke: "var(--border)" }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_PRIMARY}
                  strokeWidth={2}
                  fill={`url(#${gmvGradientId})`}
                  dot={false}
                  activeDot={{ r: 4, fill: CHART_PRIMARY, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-sky-500/15 bg-gradient-to-br from-sky-500/[0.03] to-card lg:col-span-2 shadow-sm">
        <div className="border-b border-sky-500/10 bg-sky-500/[0.04] px-5 py-4">
          <h3 className="text-sm font-semibold text-sky-700 dark:text-sky-400">New signups</h3>
          <p className="text-xs text-muted-foreground">Businesses created · last 30 days</p>
        </div>
        <div className="h-64 px-2 py-4 sm:px-4">
          {!hasSignups ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No new signups in this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupsTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={rechartsAxisTick}
                  tickFormatter={chartDayLabel}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={28}
                />
                <YAxis
                  tick={rechartsAxisTick}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip content={<SignupsTooltip />} cursor={{ fill: "var(--primary)", opacity: 0.08 }} />
                <Bar dataKey="value" fill={CHART_SECONDARY} radius={[3, 3, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
