"use client";

import type { PosReceipt } from "@/types/api";
import { formatMoney, formatSaleDate } from "@/lib/format";
import { paymentMethodMeta } from "@/lib/sales-constants";

export function PosReceiptView({ receipt }: { receipt: PosReceipt }) {
  const pay = paymentMethodMeta(receipt.payment_method);

  return (
    <div className="mx-auto max-w-sm space-y-4 p-4 font-mono text-sm print:p-0">
      <div className="text-center space-y-1">
        <p className="font-bold text-base">{receipt.business_name}</p>
        <p className="text-muted-foreground">{receipt.receipt_number}</p>
        <p className="text-xs text-muted-foreground">{formatSaleDate(receipt.sale_date)}</p>
      </div>
      <div className="border-t border-dashed pt-3 space-y-2">
        {receipt.lines.map((line, i) => (
          <div key={i} className="flex justify-between gap-2">
            <span className="flex-1">
              {line.description} × {line.quantity}
            </span>
            <span>{formatMoney(line.total, receipt.currency)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-dashed pt-3 flex justify-between font-bold">
        <span>Total</span>
        <span>{formatMoney(receipt.total, receipt.currency)}</span>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Paid: {pay?.label ?? receipt.payment_method}
        {receipt.customer_name ? ` · ${receipt.customer_name}` : ""}
      </p>
      {receipt.cashier_name ? (
        <p className="text-xs text-center text-muted-foreground">Served by {receipt.cashier_name}</p>
      ) : null}
      {receipt.footer ? (
        <p className="text-xs text-center text-muted-foreground border-t border-dashed pt-3">
          {receipt.footer}
        </p>
      ) : null}
    </div>
  );
}
