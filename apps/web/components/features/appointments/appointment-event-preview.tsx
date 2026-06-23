"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, Clock, Phone, User, X } from "lucide-react";
import {
  AppointmentStatusBadge,
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/components/features/appointments/appointment-status";
import { formatMoney } from "@/lib/format";
import type { Appointment } from "@/types/api";

export type AppointmentHoverAnchor = {
  appointment: Appointment;
  rect: Pick<DOMRect, "top" | "left" | "right" | "bottom" | "width">;
  pinned?: boolean;
};

type AppointmentEventPreviewProps = {
  anchor: AppointmentHoverAnchor;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onClose: () => void;
};

export function AppointmentEventPreview({
  anchor,
  onPointerEnter,
  onPointerLeave,
  onClose,
}: AppointmentEventPreviewProps) {
  const { appointment: a, rect, pinned } = anchor;
  const name = a.customer_name || a.guest_name || a.guest_phone || "Guest";

  const cardWidth = 280;
  const margin = 8;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;

  let top = rect.bottom + 4;
  let left = rect.left + rect.width / 2 - cardWidth / 2;

  if (left + cardWidth > viewportW - margin) {
    left = viewportW - cardWidth - margin;
  }
  if (left < margin) left = margin;

  const estimatedHeight = 240;
  if (top + estimatedHeight > viewportH - margin) {
    top = Math.max(margin, rect.top - estimatedHeight - 4);
  }

  return createPortal(
    <div
      className={`appt-cal-preview${pinned ? " is-pinned" : ""}`}
      style={{ top, left, width: cardWidth }}
      role="dialog"
      aria-label="Appointment preview"
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
    >
      <div className="appt-cal-preview-header">
        <AppointmentStatusBadge status={a.status} />
        <div className="appt-cal-preview-header-actions">
          <span className="appt-cal-preview-hint">
            {pinned ? "Pinned" : "Hover or click event"}
          </span>
          {pinned ? (
            <button
              type="button"
              className="appt-cal-preview-close"
              onClick={onClose}
              aria-label="Close preview"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      <p className="appt-cal-preview-name">{name}</p>
      <p className="appt-cal-preview-service">{a.service_name}</p>

      <div className="appt-cal-preview-meta">
        <p>
          <Clock className="h-3.5 w-3.5" />
          {formatAppointmentDate(a.start_time)}
        </p>
        <p>
          {formatAppointmentTime(a.start_time)} – {formatAppointmentTime(a.end_time)}
        </p>
      </div>

      <div className="appt-cal-preview-meta">
        {(a.customer_phone || a.guest_phone) ? (
          <p>
            <Phone className="h-3.5 w-3.5" />
            {a.customer_phone || a.guest_phone}
          </p>
        ) : null}
        {a.customer_id ? (
          <p>
            <User className="h-3.5 w-3.5" />
            Registered customer
          </p>
        ) : null}
      </div>

      <p className="appt-cal-preview-price">
        {formatMoney(a.service_price, a.currency)}
        {a.deposit_paid > 0
          ? ` · Deposit ${formatMoney(a.deposit_paid, a.currency)}`
          : ""}
      </p>

      {a.notes ? (
        <p className="appt-cal-preview-notes">&ldquo;{a.notes}&rdquo;</p>
      ) : null}

      <Link
        href={`/appointments/${a.id}`}
        className="appt-cal-preview-link"
        onClick={onClose}
      >
        View details
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>,
    document.body
  );
}
