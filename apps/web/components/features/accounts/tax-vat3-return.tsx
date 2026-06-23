"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/format";
import { totalTaxFromReturn } from "@/lib/tax-utils";
import { cn } from "@/lib/utils";
import type { VATReturn } from "@/types/api";

type TaxVat3ReturnProps = {
  vatReturn: VATReturn;
};

function ReturnRow({
  label,
  value,
  currency,
  emphasis,
}: {
  label: string;
  value: number;
  currency: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-2.5 border-b border-border/50 last:border-0",
        emphasis && "pt-3"
      )}
    >
      <span className={cn("text-sm", emphasis ? "font-semibold" : "text-muted-foreground")}>
        {label}
      </span>
      <span className={cn("text-sm tabular-nums", emphasis && "font-bold text-primary")}>
        {formatMoney(value, currency)}
      </span>
    </div>
  );
}

export function TaxVat3Return({ vatReturn }: TaxVat3ReturnProps) {
  const { currency } = vatReturn;
  const totalTax = totalTaxFromReturn(
    vatReturn.vat_total,
    vatReturn.nhil_total,
    vatReturn.getfund_total
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
          Pre-filled from invoices
        </Badge>
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {vatReturn.lines.length} invoice{vatReturn.lines.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="rounded-xl border bg-muted/10 px-4 py-1">
        <ReturnRow label="Taxable sales" value={vatReturn.taxable_total} currency={currency} />
        <ReturnRow label="Output VAT (15%)" value={vatReturn.vat_total} currency={currency} />
        <ReturnRow label="NHIL (2.5%)" value={vatReturn.nhil_total} currency={currency} />
        <ReturnRow label="GETFund (2.5%)" value={vatReturn.getfund_total} currency={currency} />
        <ReturnRow label="Total tax due" value={totalTax} currency={currency} emphasis />
      </div>

      {vatReturn.lines.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          No taxable invoices in this month. Sales without VAT will not appear here.
        </p>
      )}
    </div>
  );
}

export function TaxInvoiceTable({ vatReturn }: TaxVat3ReturnProps) {
  if (vatReturn.lines.length === 0) return null;

  const { currency } = vatReturn;

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[36rem] text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
            <th className="text-left py-2.5 px-3 font-medium">Invoice</th>
            <th className="text-left py-2.5 px-3 font-medium">Customer</th>
            <th className="text-left py-2.5 px-3 font-medium">Date</th>
            <th className="text-right py-2.5 px-3 font-medium">Taxable</th>
            <th className="text-right py-2.5 px-3 font-medium">VAT</th>
            <th className="text-right py-2.5 px-3 font-medium">NHIL + GETFund</th>
          </tr>
        </thead>
        <tbody>
          {vatReturn.lines.map((line) => (
            <tr key={line.invoice_number} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
              <td className="py-2.5 px-3 font-mono text-xs">{line.invoice_number}</td>
              <td className="py-2.5 px-3 max-w-[10rem] truncate">{line.customer_name}</td>
              <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                {new Date(line.date + (line.date.includes("T") ? "" : "T12:00:00")).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                {formatMoney(line.taxable, currency)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                {formatMoney(line.vat, currency)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                {formatMoney(line.nhil + line.getfund, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
