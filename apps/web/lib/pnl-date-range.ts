import { localDateISO, todayISO } from "@/lib/format";

export type PnlDatePreset = "month" | "last30" | "quarter" | "year";

export const PNL_DATE_PRESETS: { value: PnlDatePreset; label: string }[] = [
  { value: "month", label: "This month" },
  { value: "last30", label: "Last 30 days" },
  { value: "quarter", label: "This quarter" },
  { value: "year", label: "Year to date" },
];

export function pnlDateRange(preset: PnlDatePreset): { from: string; to: string; label: string } {
  const today = todayISO();
  const now = new Date();

  if (preset === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: localDateISO(start), to: today, label: "This month" };
  }

  if (preset === "last30") {
    const start = new Date();
    start.setDate(start.getDate() - 29);
    return { from: localDateISO(start), to: today, label: "Last 30 days" };
  }

  if (preset === "quarter") {
    const qMonth = Math.floor(now.getMonth() / 3) * 3;
    const start = new Date(now.getFullYear(), qMonth, 1);
    return { from: localDateISO(start), to: today, label: "This quarter" };
  }

  const start = new Date(now.getFullYear(), 0, 1);
  return { from: localDateISO(start), to: today, label: "Year to date" };
}

export function formatPnlPeriod(from: string, to: string): string {
  const fmt = (iso: string) =>
    new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(from)} – ${fmt(to)}`;
}
