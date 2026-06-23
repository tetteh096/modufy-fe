import type { MonthlyTrend } from "@/types/api";

/** Boron sales dashboard palette */
export const ACCOUNTS_CHART = {
  revenue: "hsl(132 42% 48%)",
  revenueMuted: "hsl(132 42% 48%)",
  expense: "hsl(0 38% 58%)",
  expenseMuted: "hsl(220 12% 42%)",
  net: "hsl(148 38% 40%)",
} as const;

export type AccountsChartPoint = {
  label: string;
  date?: string;
  in: number;
  out: number;
  net: number;
  cumulative: number;
};

export function accountsChartRows(months: MonthlyTrend[] | undefined): MonthlyTrend[] {
  return months ?? [];
}

export function monthlyTrendToChartPoints(months: MonthlyTrend[]): AccountsChartPoint[] {
  let cumulative = 0;
  return months.map((m) => {
    const inAmt = m.revenue ?? 0;
    const outAmt = m.expenses ?? 0;
    const net = inAmt - outAmt;
    cumulative += net;
    return {
      label: m.month,
      date: m.year_month,
      in: inAmt,
      out: outAmt,
      net,
      cumulative,
    };
  });
}

export function maxPointValue(
  rows: AccountsChartPoint[],
  keys: ("in" | "out" | "net" | "cumulative")[]
): number {
  let max = 0;
  for (const row of rows) {
    for (const key of keys) {
      max = Math.max(max, Math.abs(Number(row[key]) || 0));
    }
  }
  return max;
}

export function maxTrendValue(
  rows: MonthlyTrend[],
  keys: ("revenue" | "expenses" | "net")[]
): number {
  let max = 0;
  for (const row of rows) {
    for (const key of keys) {
      max = Math.max(max, Math.abs(Number(row[key]) || 0));
    }
  }
  return max;
}

export function formatChartAxis(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1000) return `${(value / 1000).toFixed(abs >= 10_000 ? 0 : 1)}k`;
  return String(Math.round(value));
}

export function cashYDomain(rows: MonthlyTrend[]): [number, number] {
  const max = maxTrendValue(rows, ["revenue", "expenses"]);
  const ceil = max <= 0 ? 100 : Math.ceil(max * 1.12);
  return [0, ceil];
}

export function netYDomain(rows: MonthlyTrend[]): [number, number] {
  if (rows.length === 0) return [-100, 100];
  const nets = rows.map((r) => r.net ?? 0);
  const min = Math.min(...nets, 0);
  const max = Math.max(...nets, 0);
  if (min === 0 && max === 0) return [-100, 100];
  const pad = Math.max((max - min) * 0.12, 1);
  return [Math.floor(min - pad), Math.ceil(max + pad)];
}

export function hasTrendActivity(rows: MonthlyTrend[]): boolean {
  return rows.some((r) => (r.revenue ?? 0) > 0 || (r.expenses ?? 0) > 0 || (r.net ?? 0) !== 0);
}
