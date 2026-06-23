"use client";

import { Clock } from "lucide-react";
import type { BusinessHoursDay } from "@/types/api";
import {
  formatDayHours,
  isOpenNow,
  openStatusLabel,
  sortedHours,
  todayHoursLine,
} from "@/lib/storefront-hours";
import { cn } from "@/lib/utils";

export function StorefrontHoursBanner({
  hours,
  isOpen,
  accent,
  className,
}: {
  hours: BusinessHoursDay[];
  isOpen?: boolean;
  accent: string;
  className?: string;
}) {
  if (!hours.length) return null;

  const open = isOpen ?? isOpenNow(hours);
  const todayLine = todayHoursLine(hours);

  return (
    <div
      className={cn(
        "border-b px-4 py-2.5 sm:px-6",
        open
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-amber-500/25 bg-amber-500/8",
        className,
      )}
      role="status"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-medium",
            open ? "text-emerald-700 dark:text-emerald-400" : "text-amber-800 dark:text-amber-300",
          )}
        >
          <Clock className="h-4 w-4 shrink-0" />
          {openStatusLabel(hours, open)}
        </span>
        {todayLine ? (
          <span className="text-muted-foreground">{todayLine.replace(/^[^:]+:\s*/, "Today · ")}</span>
        ) : null}
        {!open ? (
          <span className="text-xs text-muted-foreground">
            Orders and bookings are unavailable outside opening hours.
          </span>
        ) : null}
        <span
          className="ml-auto hidden h-2 w-2 rounded-full sm:inline-block"
          style={{ background: open ? "#16a34a" : accent }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function StorefrontHoursList({
  hours,
  accent,
  compact = false,
}: {
  hours: BusinessHoursDay[];
  accent?: string;
  compact?: boolean;
}) {
  const rows = sortedHours(hours);
  const today = new Date().getDay();

  return (
    <ul className={cn("space-y-1.5", compact ? "text-xs" : "text-sm")}>
      {rows.map((day) => {
        const isToday = day.day_of_week === today;
        return (
          <li
            key={day.day_of_week}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-2 py-1.5",
              isToday && "bg-muted/40 font-medium",
            )}
          >
            <span className={isToday ? "text-foreground" : "text-muted-foreground"}>
              {isToday ? "Today" : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.day_of_week]}
            </span>
            <span
              className={cn(
                day.is_closed ? "text-muted-foreground" : "text-foreground",
                isToday && !day.is_closed && accent && "font-semibold",
              )}
              style={isToday && !day.is_closed && accent ? { color: accent } : undefined}
            >
              {formatDayHours(day)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
