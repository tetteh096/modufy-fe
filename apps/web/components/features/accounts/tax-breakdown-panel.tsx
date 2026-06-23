"use client";

import { formatMoney } from "@/lib/format";
import { TAX_TYPE_META, taxBreakdownEntries } from "@/lib/tax-utils";

type TaxBreakdownPanelProps = {
  vat: number;
  nhil: number;
  getfund: number;
  currency: string;
};

export function TaxBreakdownPanel({ vat, nhil, getfund, currency }: TaxBreakdownPanelProps) {
  const entries = taxBreakdownEntries(vat, nhil, getfund);
  const total = vat + nhil + getfund;

  if (total <= 0) {
    return (
      <div className="space-y-3">
        {entries.map(({ key }) => {
          const meta = TAX_TYPE_META[key];
          return (
            <div key={key} className="rounded-lg border border-border/60 bg-muted/15 px-3 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{meta.label}</span>
                <span className="font-medium tabular-nums">{formatMoney(0, currency)}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-0 rounded-full" style={{ backgroundColor: meta.color }} />
              </div>
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Tax appears when you issue VAT-inclusive invoices and record payments.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {entries.map(({ key, amount, pct }) => {
        const meta = TAX_TYPE_META[key];
        return (
          <li key={key}>
            <div className="flex items-center justify-between gap-2 text-sm mb-1.5">
              <span className="font-medium">{meta.label}</span>
              <span className="tabular-nums shrink-0">{formatMoney(amount, currency)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(pct, amount > 0 ? 4 : 0)}%`,
                  backgroundColor: meta.color,
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
              {pct.toFixed(1)}% of output tax
            </p>
          </li>
        );
      })}
    </ul>
  );
}
