"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/format";
import type { ServiceStatsResponse } from "@/types/api";

export function ServicesTopBooked({
  items,
  currency = "GHS",
}: {
  items: ServiceStatsResponse["top_by_bookings"];
  currency?: string;
}) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Booking stats appear here once customers schedule appointments.
      </p>
    );
  }

  const max = Math.max(...items.map((i) => i.bookings), 1);

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.service_id} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <Link href={`/inventory/${item.service_id}`} className="font-medium hover:text-primary truncate">
              {item.service_name}
            </Link>
            <span className="text-muted-foreground tabular-nums shrink-0 text-xs">
              {formatMoney(item.revenue, currency)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/70"
              style={{ width: `${(item.bookings / max) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {item.bookings} scheduled
            {item.completed > 0 ? ` · ${item.completed} completed` : ""}
            {item.revenue > 0 ? "" : item.completed === 0 ? " · upcoming" : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
