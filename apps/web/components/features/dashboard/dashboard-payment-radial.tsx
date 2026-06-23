"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatMoney } from "@/lib/format";
import { paymentMethodMeta } from "@/lib/sales-constants";
import { rechartsTooltipStyle } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";

const CHART_COLORS = ["#5a9e6f", "#3d4654", "#c47070", "#669776", "#6c757d", "#f0ad4e"];

type DashboardPaymentRadialProps = {
  byPaymentMethod: Record<string, number>;
  currency: string;
  className?: string;
};

export function DashboardPaymentRadial({
  byPaymentMethod,
  currency,
  className,
}: DashboardPaymentRadialProps) {
  const entries = Object.entries(byPaymentMethod).filter(([, v]) => v > 0);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  if (entries.length === 0 || total <= 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <p className="text-sm text-muted-foreground">No sales by payment method yet.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Record a sale to see how customers pay you.
        </p>
      </div>
    );
  }

  const chartData = entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([method, amount], i) => ({
      method,
      name: paymentMethodMeta(method)?.label ?? method,
      amount,
      value: Math.max(8, Math.round((amount / total) * 100)),
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));

  return (
    <div className={cn("space-y-4 bizos-chart", className)}>
      <ResponsiveContainer width="100%" height={240}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="18%"
          outerRadius="95%"
          barSize={14}
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            background={{ fill: "rgba(170,184,197,0.22)" }}
            dataKey="value"
            cornerRadius={6}
          />
          <Tooltip
            contentStyle={rechartsTooltipStyle}
            formatter={(_, __, item) => {
              const row = item.payload as { name: string; amount: number; value: number };
              return [
                `${formatMoney(row.amount, currency)} (${row.value}%)`,
                row.name,
              ];
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <ul className="space-y-2.5">
        {chartData.map((row) => (
          <li key={row.method} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: row.fill }}
              />
              <span className="truncate">{row.name}</span>
            </span>
            <span className="tabular-nums font-medium shrink-0">
              {formatMoney(row.amount, currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
