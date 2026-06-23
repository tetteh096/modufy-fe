import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/api";

export const appointmentStatusConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  in_progress: {
    label: "In progress",
    className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
  completed: {
    label: "Completed",
    className: "bg-primary/10 text-primary",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
  },
  cancelled_by_customer: {
    label: "Cancelled (customer)",
    className: "bg-muted text-muted-foreground",
  },
  cancelled_by_business: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
  },
  no_show: {
    label: "No-show",
    className: "bg-destructive/10 text-destructive",
  },
  rescheduled: {
    label: "Rescheduled",
    className: "bg-muted text-muted-foreground",
  },
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = appointmentStatusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="secondary" className={cn("font-normal capitalize", cfg.className)}>
      {cfg.label}
    </Badge>
  );
}

export function formatAppointmentTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatAppointmentDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
