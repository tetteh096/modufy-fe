"use client";

import { FileText, Wallet, CheckCircle2, AlertTriangle, FilePenLine } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { InvoiceSummary } from "@/lib/invoice-utils";
import { Skeleton } from "@/components/ui/skeleton";

type InvoicesSummaryStripProps = {
  summary: InvoiceSummary;
  currency: string;
  periodLabel: string;
  loading?: boolean;
};

export function InvoicesSummaryStrip({
  summary,
  currency,
  periodLabel,
  loading,
}: InvoicesSummaryStripProps) {
  const items = [
    {
      label: "Documents",
      value: String(summary.total),
      hint: periodLabel,
      icon: FileText,
    },
    {
      label: "To collect",
      value: formatMoney(summary.outstandingAmount, currency),
      hint:
        summary.outstandingCount > 0
          ? `${summary.outstandingCount} open`
          : "Nothing outstanding",
      icon: Wallet,
      accent: summary.outstandingCount > 0 ? "primary" : undefined,
    },
    {
      label: "Paid",
      value: formatMoney(summary.paidAmount, currency),
      hint: `${summary.paidCount} settled`,
      icon: CheckCircle2,
      accent: "success" as const,
    },
    {
      label: "Overdue",
      value: String(summary.overdueCount),
      hint: summary.overdueCount > 0 ? "Needs follow-up" : "All on time",
      icon: AlertTriangle,
      accent: summary.overdueCount > 0 ? "destructive" : undefined,
    },
    {
      label: "Drafts",
      value: String(summary.draftCount),
      hint: "Not sent yet",
      icon: FilePenLine,
    },
  ];

  return (
    <div className="rounded-xl border border-primary/10 bg-primary/[0.04] dark:bg-primary/[0.07] overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            {loading ? (
              <Skeleton className="mt-2 mx-auto h-7 w-20" />
            ) : (
              <>
                <p
                  className={cn(
                    "mt-1.5 text-lg font-bold tabular-nums tracking-tight",
                    item.accent === "destructive" && "text-destructive",
                    item.accent === "primary" && "text-primary",
                    item.accent === "success" && "text-primary"
                  )}
                >
                  {item.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.hint}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
