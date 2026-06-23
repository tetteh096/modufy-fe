import type { Invoice, InvoiceDocType } from "@/types/api";

const OUTSTANDING_STATUSES: Invoice["status"][] = ["sent", "viewed", "partial", "overdue"];

export function invStr(inv: Invoice, camel: string, snake: string): string {
  const v = (inv as unknown as Record<string, unknown>)[camel];
  if (typeof v === "string" && v) return v;
  return (inv as unknown as Record<string, string>)[snake] ?? "";
}

export function invNum(inv: Invoice, camel: string, snake: string): number {
  const v = (inv as unknown as Record<string, unknown>)[camel];
  if (typeof v === "number") return v;
  return Number((inv as unknown as Record<string, number>)[snake] ?? 0);
}

export function invoiceDocType(inv: Invoice): InvoiceDocType {
  return (invStr(inv, "type", "type") || "invoice") as InvoiceDocType;
}

export function invoiceStatus(inv: Invoice): Invoice["status"] {
  return (invStr(inv, "status", "status") || "draft") as Invoice["status"];
}

export function invoiceAmountDue(inv: Invoice): number {
  return invNum(inv, "amountDue", "amount_due");
}

export function invoiceTotal(inv: Invoice): number {
  return invNum(inv, "total", "total");
}

export function isOutstanding(inv: Invoice): boolean {
  const status = invoiceStatus(inv);
  return OUTSTANDING_STATUSES.includes(status) && invoiceAmountDue(inv) > 0;
}

export function isOverdue(inv: Invoice): boolean {
  if (invoiceStatus(inv) === "overdue") return true;
  const due = invStr(inv, "dueDate", "due_date");
  if (!due || invoiceAmountDue(inv) <= 0) return false;
  const d = new Date(due.includes("T") ? due : `${due}T12:00:00`);
  return d < new Date(new Date().setHours(0, 0, 0, 0));
}

export function paidRatio(inv: Invoice): number {
  const total = invoiceTotal(inv);
  if (total <= 0) return 0;
  const due = invoiceAmountDue(inv);
  return Math.min(1, Math.max(0, (total - due) / total));
}

export type InvoiceSummary = {
  total: number;
  outstandingCount: number;
  outstandingAmount: number;
  paidCount: number;
  paidAmount: number;
  draftCount: number;
  overdueCount: number;
  byStatus: Record<string, number>;
};

export function computeInvoiceSummary(invoices: Invoice[]): InvoiceSummary {
  const byStatus: Record<string, number> = {};
  let outstandingCount = 0;
  let outstandingAmount = 0;
  let paidCount = 0;
  let paidAmount = 0;
  let draftCount = 0;
  let overdueCount = 0;

  for (const inv of invoices) {
    const status = invoiceStatus(inv);
    byStatus[status] = (byStatus[status] ?? 0) + 1;

    if (status === "draft") draftCount++;
    if (status === "paid") {
      paidCount++;
      paidAmount += invoiceTotal(inv);
    }
    if (isOutstanding(inv)) {
      outstandingCount++;
      outstandingAmount += invoiceAmountDue(inv);
    }
    if (isOverdue(inv)) overdueCount++;
  }

  return {
    total: invoices.length,
    outstandingCount,
    outstandingAmount,
    paidCount,
    paidAmount,
    draftCount,
    overdueCount,
    byStatus,
  };
}

export type InvoiceStatusFilter = "all" | "collect" | Invoice["status"];

export function filterInvoicesByStatus(
  invoices: Invoice[],
  filter: InvoiceStatusFilter
): Invoice[] {
  if (filter === "all") return invoices;
  if (filter === "collect") return invoices.filter(isOutstanding);
  return invoices.filter((inv) => invoiceStatus(inv) === filter);
}
