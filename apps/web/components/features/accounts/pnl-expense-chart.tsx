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
  Cell,
} from "recharts";
import { formatMoney, formatExpenseCategory } from "@/lib/format";
import { ACCOUNTS_CHART, formatChartAxis } from "@/lib/accounts-chart-utils";
import { rechartsAxisTick } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";
import type { PnLLineItem } from "@/types/api";

const EXPENSE_PALETTE = [
  ACCOUNTS_CHART.expense,
  "hsl(220 12% 42%)",
  "hsl(38 80% 52%)",
  "hsl(262 45% 55%)",
  "hsl(199 55% 48%)",
  "hsl(330 45% 55%)",
];

type PnlExpenseChartProps = {
  items: PnLLineItem[];
  currency: string;
  className?: string;
};

function ExpenseTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: PnLLineItem & { label: string } }>;
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1">{row.label}</p>
      <p className="tabular-nums">{formatMoney(row.amount, currency)}</p>
      <p className="text-muted-foreground mt-0.5">{row.pct.toFixed(1)}% of expenses</p>
    </div>
  );
}

export function PnlExpenseChart({ items, currency, className }: PnlExpenseChartProps) {
  const uid = useId().replace(/:/g, "");

  const chartData = items.map((row) => ({
    ...row,
    label: formatExpenseCategory(row.category),
  }));

  const maxVal = Math.max(...chartData.map((d) => d.amount), 1);

  if (chartData.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground text-center py-12", className)}>
        No expenses recorded for this period.
      </p>
    );
  }

  return (
    <div className={cn("bizos-chart", className)}>
      <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 44)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
          barSize={20}
        >
          <defs>
            {chartData.map((_, i) => (
              <linearGradient key={i} id={`${uid}-exp-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={EXPENSE_PALETTE[i % EXPENSE_PALETTE.length]} stopOpacity={0.95} />
                <stop offset="100%" stopColor={EXPENSE_PALETTE[i % EXPENSE_PALETTE.length]} stopOpacity={0.55} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid horizontal={false} strokeDasharray="4 4" stroke="var(--border)" strokeOpacity={0.55} />
          <XAxis
            type="number"
            tick={rechartsAxisTick}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatChartAxis}
            domain={[0, Math.ceil(maxVal * 1.12)]}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={rechartsAxisTick}
            axisLine={false}
            tickLine={false}
            width={88}
          />
          <Tooltip content={<ExpenseTooltip currency={currency} />} cursor={{ fill: "var(--muted)", opacity: 0.35 }} />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={`url(#${uid}-exp-${i})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
