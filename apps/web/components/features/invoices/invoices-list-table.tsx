"use client";

import Link from "next/link";
import {
  MoreHorizontal,
  Trash2,
  Send,
  CreditCard,
  Pencil,
  FileText,
  ChevronRight,
} from "lucide-react";
import { formatMoney, formatDate } from "@/lib/format";
import {
  invStr,
  invoiceStatus,
  invoiceDocType,
  invoiceAmountDue,
  invoiceTotal,
  isOverdue,
  paidRatio,
} from "@/lib/invoice-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Invoice, InvoiceDocType } from "@/types/api";
import { cn } from "@/lib/utils";
import { tableRowMenuButtonClass } from "@/components/shared/table-row-actions";

export const invoiceStatusConfig: Record<
  Invoice["status"],
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  pending_vsdc: {
    label: "GRA pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  viewed: {
    label: "Viewed",
    className: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
  },
  sent: {
    label: "Sent",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  partial: {
    label: "Partial",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  paid: { label: "Paid", className: "bg-primary/10 text-primary" },
  overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
};

const docTypeConfig: Record<
  InvoiceDocType,
  { label: string; className: string }
> = {
  invoice: { label: "Invoice", className: "bg-primary/10 text-primary" },
  quote: {
    label: "Quote",
    className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  proforma: {
    label: "Proforma",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

function InvoiceRowActions({
  invoice,
  onDelete,
  onSend,
}: {
  invoice: Invoice;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
}) {
  const status = invoiceStatus(invoice);
  const docType = invoiceDocType(invoice);
  const canSend = status === "draft" && docType === "invoice";
  const canEdit = status === "draft";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className={tableRowMenuButtonClass}
            aria-label="Invoice actions"
          />
        }
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={`/invoices/${invoice.id}`} />}>
          View
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem render={<Link href={`/invoices/${invoice.id}/edit`} />}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {canSend && (
          <DropdownMenuItem onClick={() => onSend(invoice.id)}>
            <Send className="mr-2 h-4 w-4" />
            Send
          </DropdownMenuItem>
        )}
        {status !== "paid" && status !== "cancelled" && (
          <DropdownMenuItem render={<Link href={`/invoices/${invoice.id}`} />}>
            <CreditCard className="mr-2 h-4 w-4" />
            Record payment
          </DropdownMenuItem>
        )}
        {status === "draft" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(invoice.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete draft
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function InvoiceRow({
  invoice,
  onDelete,
  onSend,
}: {
  invoice: Invoice;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
}) {
  const number = invStr(invoice, "number", "number");
  const customerName = invStr(invoice, "customerName", "customer_name") || "—";
  const currency = invStr(invoice, "currency", "currency");
  const total = invoiceTotal(invoice);
  const amountDue = invoiceAmountDue(invoice);
  const status = invoiceStatus(invoice);
  const docType = invoiceDocType(invoice);
  const createdAt = invStr(invoice, "createdAt", "created_at");
  const dueDate = invStr(invoice, "dueDate", "due_date");
  const overdue = isOverdue(invoice);
  const ratio = paidRatio(invoice);

  const statusMeta = invoiceStatusConfig[status] ?? invoiceStatusConfig.draft;
  const typeMeta = docTypeConfig[docType] ?? docTypeConfig.invoice;
  const showOutstanding =
    status !== "paid" && status !== "cancelled" && amountDue > 0;

  return (
    <div className="group relative border-b border-border/60 last:border-0">
      <Link
        href={`/invoices/${invoice.id}`}
        className="flex items-start gap-3 px-4 py-4 md:px-5 transition-colors hover:bg-muted/30"
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            overdue
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-border/60 bg-muted/30 text-muted-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                {number}
              </span>
              <Badge className={cn("text-[10px] border-0 font-normal h-5", typeMeta.className)}>
                {typeMeta.label}
              </Badge>
              <Badge className={cn("text-[10px] border-0 h-5", statusMeta.className)}>
                {statusMeta.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{customerName}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
              {createdAt && <span>Issued {formatDate(createdAt)}</span>}
              {dueDate && (
                <span className={cn(overdue && "text-destructive font-medium")}>
                  Due {formatDate(dueDate)}
                  {overdue ? " · overdue" : ""}
                </span>
              )}
            </div>
            {status === "partial" && (
              <div className="flex items-center gap-2 max-w-xs pt-0.5">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.round(ratio * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                  {Math.round(ratio * 100)}% paid
                </span>
              </div>
            )}
          </div>

          <div className="flex items-end md:items-center justify-between md:justify-end gap-4 md:text-right shrink-0">
            <div>
              <p className="text-sm font-bold tabular-nums">{formatMoney(total, currency)}</p>
              {showOutstanding ? (
                <p
                  className={cn(
                    "text-xs tabular-nums mt-0.5",
                    overdue ? "text-destructive font-medium" : "text-muted-foreground"
                  )}
                >
                  {formatMoney(amountDue, currency)} due
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">Settled</p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 hidden sm:block group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Link>

      <div className="absolute top-4 right-3 md:right-4">
        <InvoiceRowActions invoice={invoice} onDelete={onDelete} onSend={onSend} />
      </div>
    </div>
  );
}

export function InvoicesListTable({
  invoices,
  onDelete,
  onSend,
}: {
  invoices: Invoice[];
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
}) {
  return (
    <div className="divide-y divide-border/60">
      {invoices.map((inv) => (
        <InvoiceRow
          key={inv.id}
          invoice={inv}
          onDelete={onDelete}
          onSend={onSend}
        />
      ))}
    </div>
  );
}
