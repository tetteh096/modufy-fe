import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Bell, CalendarDays, Clock, FileText, Package, Receipt } from "lucide-react";

export type AttentionSeverity = "critical" | "warning" | "info";

export type AlertTabKey = "all" | "due_soon" | "invoices" | "inventory" | "appointments" | "tax";

export const ALERT_TABS: {
  key: AlertTabKey;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    key: "all",
    label: "All",
    description: "Everything that needs your attention across the business.",
    icon: Bell,
  },
  {
    key: "due_soon",
    label: "Due soon",
    description: "Invoices due within your configured window (default 3 days).",
    icon: Clock,
  },
  {
    key: "invoices",
    label: "Invoices",
    description: "Overdue, unpaid, and invoices waiting on GRA approval.",
    icon: FileText,
  },
  {
    key: "inventory",
    label: "Stock",
    description: "Products at or below their low-stock threshold.",
    icon: Package,
  },
  {
    key: "appointments",
    label: "Appointments",
    description: "Bookings awaiting confirmation and sessions starting soon.",
    icon: CalendarDays,
  },
  {
    key: "tax",
    label: "Tax & VAT",
    description: "Monthly VAT filing reminders and compliance items.",
    icon: Receipt,
  },
];

export const ATTENTION_SEVERITY_META: Record<
  AttentionSeverity,
  { label: string; className: string; dotClass: string }
> = {
  critical: {
    label: "Urgent",
    className: "border-destructive/30 bg-destructive/5 dark:bg-destructive/10",
    dotClass: "bg-destructive",
  },
  warning: {
    label: "Needs action",
    className: "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10",
    dotClass: "bg-amber-500",
  },
  info: {
    label: "FYI",
    className: "border-border/60 bg-muted/20",
    dotClass: "bg-muted-foreground",
  },
};

export const ATTENTION_TYPE_META: Record<string, { icon: LucideIcon }> = {
  invoice_overdue: { icon: AlertTriangle },
  invoice_due_soon: { icon: Clock },
  invoice_unpaid: { icon: FileText },
  invoice_pending_vsdc: { icon: FileText },
  low_stock: { icon: Package },
  appointment_pending: { icon: CalendarDays },
  appointment_upcoming: { icon: CalendarDays },
  tax_filing_due: { icon: Receipt },
  default: { icon: Bell },
};

export function notificationHref(event: string): string {
  switch (event) {
    case "low_stock":
      return "/alerts?tab=inventory";
    case "invoice_paid":
    case "invoice_overdue":
      return "/alerts?tab=invoices";
    case "stock_writeoff":
      return "/inventory";
    default:
      return "/alerts";
  }
}

export function tabCount(
  byCategory: Record<string, number> | undefined,
  tab: AlertTabKey
): number {
  if (!byCategory) return 0;
  return byCategory[tab] ?? 0;
}
