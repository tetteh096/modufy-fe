"use client";

import { cn } from "@/lib/utils";
import { PeriodFilterTabs } from "@/components/shared/period-filter-tabs";
import { invoiceStatusConfig } from "@/components/features/invoices/invoices-list-table";
import type { PeriodFilter } from "@/lib/period-range";
import type { Invoice, InvoiceDocType } from "@/types/api";
import type { InvoiceStatusFilter } from "@/lib/invoice-utils";

const TYPE_OPTIONS: { value: "all" | InvoiceDocType; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "invoice", label: "Invoices" },
  { value: "quote", label: "Quotes" },
  { value: "proforma", label: "Proformas" },
];

const STATUS_OPTIONS: { value: InvoiceStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "collect", label: "To collect" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "partial", label: "Partial" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

type InvoicesToolbarProps = {
  period: PeriodFilter;
  onPeriodChange: (p: PeriodFilter) => void;
  typeFilter: "all" | InvoiceDocType;
  onTypeChange: (t: "all" | InvoiceDocType) => void;
  statusFilter: InvoiceStatusFilter;
  onStatusChange: (s: InvoiceStatusFilter) => void;
  statusCounts: Record<string, number>;
  collectCount: number;
};

function FilterChip({
  active,
  label,
  count,
  onClick,
  variant,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
  variant?: "destructive" | "primary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? variant === "destructive"
            ? "border-destructive/40 bg-destructive/10 text-destructive"
            : variant === "primary"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-primary/30 bg-primary/10 text-primary"
          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      {label}
      {count != null && count > 0 && (
        <span
          className={cn(
            "min-w-[1.125rem] rounded-full px-1.5 py-0 text-[10px] tabular-nums",
            active ? "bg-background/60" : "bg-muted"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function InvoicesToolbar({
  period,
  onPeriodChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  statusCounts,
  collectCount,
}: InvoicesToolbarProps) {
  return (
    <div className="space-y-4 p-4 md:p-5 border-b border-border/60 bg-muted/10">
      <PeriodFilterTabs value={period} onChange={onPeriodChange} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              active={typeFilter === opt.value}
              label={opt.label}
              onClick={() => onTypeChange(opt.value)}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const count =
              opt.value === "collect"
                ? collectCount
                : opt.value === "all"
                  ? undefined
                  : statusCounts[opt.value as Invoice["status"]] ?? 0;
            const variant =
              opt.value === "overdue"
                ? "destructive"
                : opt.value === "collect"
                  ? "primary"
                  : undefined;
            const label =
              opt.value === "draft" || opt.value === "sent" || opt.value === "partial" || opt.value === "paid" || opt.value === "overdue"
                ? invoiceStatusConfig[opt.value]?.label ?? opt.label
                : opt.label;

            return (
              <FilterChip
                key={opt.value}
                active={statusFilter === opt.value}
                label={label}
                count={count}
                onClick={() => onStatusChange(opt.value)}
                variant={variant}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
