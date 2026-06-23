import { localDateISO, todayISO } from "@/lib/format";

export type PeriodFilter = "today" | "week" | "month" | "last30" | "all";

export const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "last30", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

/** Dashboard overview: today, week, month only */
export const DASHBOARD_PERIOD_OPTIONS = PERIOD_OPTIONS.filter((o) =>
  (["today", "week", "month"] as PeriodFilter[]).includes(o.value)
);

export type DashboardPeriodFilter = "today" | "week" | "month";

export type PeriodRange = {
  from?: string;
  to?: string;
  /** Summary API params */
  summaryParams: { date?: string; from?: string; to?: string; period?: string };
  /** Chart API params */
  chartFrom: string;
  chartTo: string;
  label: string;
  chartSubtitle: string;
};

export function periodRange(filter: PeriodFilter): PeriodRange {
  const today = todayISO();

  if (filter === "today") {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    return {
      from: today,
      to: today,
      summaryParams: { from: today, to: today },
      chartFrom: localDateISO(weekStart),
      chartTo: today,
      label: "Today",
      chartSubtitle: "Last 7 days (overview)",
    };
  }

  if (filter === "week") {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    const from = localDateISO(d);
    return {
      from,
      to: today,
      summaryParams: { from, to: today },
      chartFrom: from,
      chartTo: today,
      label: "This week",
      chartSubtitle: "Last 7 days",
    };
  }

  if (filter === "month") {
    const start = new Date();
    start.setDate(1);
    const from = localDateISO(start);
    return {
      from,
      to: today,
      summaryParams: { from, to: today },
      chartFrom: from,
      chartTo: today,
      label: "This month",
      chartSubtitle: "Daily totals this month",
    };
  }

  if (filter === "last30") {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    const from = localDateISO(d);
    return {
      from,
      to: today,
      summaryParams: { from, to: today },
      chartFrom: from,
      chartTo: today,
      label: "Last 30 days",
      chartSubtitle: "Last 30 days",
    };
  }

  const d = new Date();
  d.setDate(d.getDate() - 89);
  const chartFrom = localDateISO(d);
  return {
    from: undefined,
    to: undefined,
    summaryParams: { period: "all" },
    chartFrom,
    chartTo: today,
    label: "All time",
    chartSubtitle: "Last 90 days",
  };
}
