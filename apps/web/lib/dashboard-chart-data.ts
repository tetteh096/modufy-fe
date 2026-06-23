import { localDateISO } from "@/lib/format";
import type { ExpenseTrendDay, SalesTrendDay } from "@/types/api";

export function eachDayInRange(from: string, to: string): string[] {
  const start = new Date(from + "T12:00:00");
  const end = new Date(to + "T12:00:00");
  const days: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(localDateISO(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export type DashboardChartDay = {
  date: string;
  label: string;
  in: number;
  out: number;
  net: number;
  cumulative: number;
};

/** Axis label for daily trend bar charts (≤7 days → weekday; longer → month + day, thinned). */
export function trendChartDayLabel(iso: string, dayCount: number, index = 0): string {
  const d = new Date(iso + "T12:00:00");
  if (dayCount <= 7) {
    return d.toLocaleDateString(undefined, { weekday: "short" });
  }
  const step = dayCount <= 14 ? 2 : dayCount <= 21 ? 3 : dayCount <= 31 ? 5 : 7;
  if (index !== 0 && index !== dayCount - 1 && index % step !== 0) {
    return "";
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Full date for tooltips on trend bars. */
export function trendChartDayTitle(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function chartRangeTotals(
  revenue: SalesTrendDay[],
  spending: ExpenseTrendDay[],
  from: string,
  to: string
) {
  const days = mergeTrendDays(revenue, spending, from, to);
  const totalIn = days.reduce((s, d) => s + d.in, 0);
  const totalOut = days.reduce((s, d) => s + d.out, 0);
  const saleCount = revenue
    .filter((d) => d.date >= from && d.date <= to)
    .reduce((s, d) => s + d.count, 0);
  return {
    revenue: totalIn,
    expenses: totalOut,
    net: totalIn - totalOut,
    saleCount,
  };
}

export function mergeTrendDays(
  revenue: SalesTrendDay[],
  spending: ExpenseTrendDay[],
  from: string,
  to: string
): DashboardChartDay[] {
  const revList = Array.isArray(revenue) ? revenue : [];
  const spendList = Array.isArray(spending) ? spending : [];
  const revMap = new Map(revList.map((d) => [d.date, d.total]));
  const spendMap = new Map(spendList.map((d) => [d.date, d.total]));
  const dayCount = eachDayInRange(from, to).length;
  let cumulative = 0;

  return eachDayInRange(from, to).map((date, index) => {
    const inAmt = revMap.get(date) ?? 0;
    const outAmt = spendMap.get(date) ?? 0;
    const net = inAmt - outAmt;
    cumulative += net;

    return {
      date,
      label: trendChartDayLabel(date, dayCount, index),
      in: inAmt,
      out: outAmt,
      net,
      cumulative,
    };
  });
}
