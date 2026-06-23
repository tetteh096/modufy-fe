import { localDateISO, todayISO } from "@/lib/format";

export type AccountsPeriodFilter = "today" | "week" | "month" | "6months" | "year";

export const ACCOUNTS_PERIOD_OPTIONS: { value: AccountsPeriodFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "6months", label: "6 months" },
  { value: "year", label: "1 year" },
];

export type AccountsPeriodRange = {
  summaryFrom: string;
  summaryTo: string;
  chartFrom: string;
  chartTo: string;
  chartMode: "daily" | "monthly";
  trendMonths: number;
  label: string;
  chartSubtitle: string;
};

export function accountsPeriodRange(filter: AccountsPeriodFilter): AccountsPeriodRange {
  const today = todayISO();

  if (filter === "today") {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    return {
      summaryFrom: today,
      summaryTo: today,
      chartFrom: localDateISO(weekStart),
      chartTo: today,
      chartMode: "daily",
      trendMonths: 1,
      label: "Today",
      chartSubtitle: "Last 7 days · daily",
    };
  }

  if (filter === "week") {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    const from = localDateISO(d);
    return {
      summaryFrom: from,
      summaryTo: today,
      chartFrom: from,
      chartTo: today,
      chartMode: "daily",
      trendMonths: 1,
      label: "This week",
      chartSubtitle: "Daily totals · 7 days",
    };
  }

  if (filter === "month") {
    const start = new Date();
    start.setDate(1);
    const from = localDateISO(start);
    return {
      summaryFrom: from,
      summaryTo: today,
      chartFrom: from,
      chartTo: today,
      chartMode: "daily",
      trendMonths: 1,
      label: "This month",
      chartSubtitle: "Daily totals this month",
    };
  }

  if (filter === "6months") {
    const d = new Date();
    d.setMonth(d.getMonth() - 5);
    d.setDate(1);
    const from = localDateISO(d);
    return {
      summaryFrom: from,
      summaryTo: today,
      chartFrom: from,
      chartTo: today,
      chartMode: "monthly",
      trendMonths: 6,
      label: "6 months",
      chartSubtitle: "Monthly totals · 6 months",
    };
  }

  const d = new Date();
  d.setMonth(d.getMonth() - 11);
  d.setDate(1);
  const from = localDateISO(d);
  return {
    summaryFrom: from,
    summaryTo: today,
    chartFrom: from,
    chartTo: today,
    chartMode: "monthly",
    trendMonths: 12,
    label: "1 year",
    chartSubtitle: "Monthly totals · 12 months",
  };
}
