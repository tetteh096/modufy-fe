import type { CashFlowLine } from "@/types/api";

export type CashFlowChartPoint = {
  date: string;
  label: string;
  in: number;
  out: number;
  net: number;
  running: number;
};

export function cashFlowChartPoints(daily: CashFlowLine[]): CashFlowChartPoint[] {
  return daily.map((d) => {
    const date = new Date(d.date + "T12:00:00");
    return {
      date: d.date,
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      in: d.in,
      out: d.out,
      net: d.net,
      running: d.running,
    };
  });
}

export function paymentMethodEntries(byMethod: Record<string, number>) {
  const total = Object.values(byMethod).reduce((s, v) => s + v, 0);
  return Object.entries(byMethod)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([method, amount]) => ({
      method,
      amount,
      pct: total > 0 ? (amount / total) * 100 : 0,
    }));
}
