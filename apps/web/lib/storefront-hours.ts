import type { BusinessHoursDay } from "@/types/api";

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function sortedHours(hours: BusinessHoursDay[]): BusinessHoursDay[] {
  return [...hours].sort((a, b) => a.day_of_week - b.day_of_week);
}

export function formatTime12(hhmm: string): string {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return hhmm;
  const [hRaw, mRaw] = hhmm.split(":");
  const h = Number(hRaw);
  const m = Number(mRaw);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDayHours(day: BusinessHoursDay): string {
  if (day.is_closed) return "Closed";
  if (!day.open_time || !day.close_time) return "Closed";
  return `${formatTime12(day.open_time)} – ${formatTime12(day.close_time)}`;
}

function parseMinutes(hhmm: string): number | null {
  if (!/^\d{1,2}:\d{2}$/.test(hhmm)) return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function isOpenNow(hours: BusinessHoursDay[], now = new Date()): boolean {
  const day = hours.find((d) => d.day_of_week === now.getDay());
  if (!day || day.is_closed) return false;
  const openMin = parseMinutes(day.open_time);
  const closeMin = parseMinutes(day.close_time);
  if (openMin === null || closeMin === null || closeMin <= openMin) return false;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= openMin && nowMin < closeMin;
}

export function openStatusLabel(hours: BusinessHoursDay[], isOpen?: boolean): string {
  const open = isOpen ?? isOpenNow(hours);
  if (open) return "Open now";
  const today = hours.find((d) => d.day_of_week === new Date().getDay());
  if (today?.is_closed) return "Closed today";
  return "Closed now";
}

export function todayHoursLine(hours: BusinessHoursDay[]): string {
  const today = hours.find((d) => d.day_of_week === new Date().getDay());
  if (!today) return "";
  return `${DAY_NAMES[today.day_of_week]}: ${formatDayHours(today)}`;
}

/** True when the business enforces hours and is currently closed. */
export function storefrontIsClosed(sf: {
  hours_enabled?: boolean;
  is_open_now?: boolean;
} | null | undefined): boolean {
  return Boolean(sf?.hours_enabled && !sf.is_open_now);
}
