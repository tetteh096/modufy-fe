import type { CalendarView } from "@/components/features/appointments/appointments-calendar-types";

/** FullCalendar `end` is exclusive — step back one day for display. */
export function endInclusive(end: Date) {
  const d = new Date(end);
  d.setDate(d.getDate() - 1);
  return d;
}

export function formatCalendarRangeLabel(start: Date, end: Date, view: CalendarView): string {
  const last = endInclusive(end);

  if (view === "today") {
    return start.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  if (view === "week") {
    const sameYear = start.getFullYear() === last.getFullYear();
    const startStr = start.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const endStr = last.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: sameYear ? undefined : "numeric",
    });
    return `${startStr} – ${endStr}${sameYear ? `, ${last.getFullYear()}` : ""}`;
  }

  return start.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
