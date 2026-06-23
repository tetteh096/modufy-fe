"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatMoney } from "@/lib/format";
import {
  AppointmentStatusBadge,
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/components/features/appointments/appointment-status";
import type { Appointment } from "@/types/api";

export function AppointmentsListTable({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-muted-foreground md:px-6">
        No appointments match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 md:px-6">Date</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => {
            const name = a.customer_name || a.guest_name || a.guest_phone || "Guest";
            const phone = a.customer_phone || a.guest_phone;
            return (
              <tr
                key={a.id}
                className="border-b transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-medium md:px-6">
                  {formatAppointmentDate(a.start_time)}
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {formatAppointmentTime(a.start_time)}
                  <span className="mx-1">–</span>
                  {formatAppointmentTime(a.end_time)}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{name}</p>
                  {phone ? (
                    <p className="text-xs text-muted-foreground">{phone}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.service_name}</td>
                <td className="px-4 py-3">
                  <AppointmentStatusBadge status={a.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatMoney(a.service_price, a.currency)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/appointments/${a.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    title="Open details"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
