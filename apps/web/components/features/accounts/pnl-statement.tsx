"use client";

import { formatMoney, formatExpenseCategory } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PnLLineItem, PnLReport } from "@/types/api";

function MoneyCell({
  amount,
  currency,
  emphasis,
  negative,
}: {
  amount: number;
  currency: string;
  emphasis?: boolean;
  negative?: boolean;
}) {
  return (
    <span
      className={cn(
        "tabular-nums text-sm",
        emphasis && "font-semibold",
        negative && amount > 0 && "text-destructive"
      )}
    >
      {formatMoney(amount, currency)}
    </span>
  );
}

function PctCell({ pct }: { pct?: number }) {
  if (pct === undefined || Number.isNaN(pct)) return <span className="text-muted-foreground/40">—</span>;
  return <span className="tabular-nums text-xs text-muted-foreground">{pct.toFixed(1)}%</span>;
}

function StatementRow({
  label,
  amount,
  currency,
  pct,
  indent,
  emphasis,
  negative,
}: {
  label: string;
  amount: number;
  currency: string;
  pct?: number;
  indent?: boolean;
  emphasis?: boolean;
  negative?: boolean;
}) {
  return (
    <tr className={cn("border-b border-border/40 last:border-0", emphasis && "bg-muted/20")}>
      <td className={cn("py-2.5 pr-4 text-sm", indent && "pl-5 text-muted-foreground", emphasis && "font-medium")}>
        {label}
      </td>
      <td className="py-2.5 px-2 text-right whitespace-nowrap">
        <MoneyCell amount={amount} currency={currency} emphasis={emphasis} negative={negative} />
      </td>
      <td className="py-2.5 pl-2 text-right w-16">
        <PctCell pct={pct} />
      </td>
    </tr>
  );
}

function MarginRow({ label, pct }: { label: string; pct: number }) {
  return (
    <tr className="border-b border-border/40">
      <td className="py-2 pl-5 text-sm text-muted-foreground">{label}</td>
      <td className="py-2 px-2 text-right">
        <span
          className={cn(
            "text-sm font-medium tabular-nums",
            pct >= 0 ? "text-primary" : "text-destructive"
          )}
        >
          {pct.toFixed(1)}%
        </span>
      </td>
      <td className="py-2 pl-2" />
    </tr>
  );
}

type PnlStatementProps = {
  pnl: PnLReport;
};

export function PnlStatement({ pnl }: PnlStatementProps) {
  const { currency } = pnl;

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[20rem]">
        <thead>
          <tr className="border-b bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
            <th className="py-2.5 px-4 text-left font-medium">Line item</th>
            <th className="py-2.5 px-2 text-right font-medium">Amount</th>
            <th className="py-2.5 pl-2 pr-4 text-right font-medium w-16">Share</th>
          </tr>
        </thead>
        <tbody className="px-2">
          <StatementRow label="Revenue" amount={pnl.revenue} currency={currency} emphasis pct={100} />
          {pnl.revenue_by_source.map((row) => (
            <StatementRow
              key={row.category}
              label={row.category}
              amount={row.amount}
              currency={currency}
              pct={row.pct}
              indent
            />
          ))}

          {pnl.discounts_given > 0 && (
            <>
              <StatementRow
                label="Discounts & promotions"
                amount={pnl.discounts_given}
                currency={currency}
                indent
                negative
              />
              {pnl.discounts_by_source.map((row) => (
                <StatementRow
                  key={row.category}
                  label={row.category}
                  amount={row.amount}
                  currency={currency}
                  pct={row.pct}
                  indent
                  negative
                />
              ))}
            </>
          )}

          <StatementRow label="Cost of goods sold" amount={pnl.cogs} currency={currency} indent negative />
          <StatementRow label="Gross profit" amount={pnl.gross_profit} currency={currency} emphasis />
          <MarginRow label="Gross margin" pct={pnl.gross_margin_pct} />

          <StatementRow label="Operating expenses" amount={pnl.expenses} currency={currency} emphasis negative />
          {pnl.expenses_by_category.map((row) => (
            <StatementRow
              key={row.category}
              label={formatExpenseCategory(row.category)}
              amount={row.amount}
              currency={currency}
              pct={row.pct}
              indent
              negative
            />
          ))}

          <StatementRow label="EBITDA" amount={pnl.ebitda} currency={currency} emphasis />
          <StatementRow label="Tax" amount={pnl.tax_owed} currency={currency} indent negative />

          <tr className="bg-primary/[0.06] dark:bg-primary/[0.1]">
            <td className="py-3.5 px-4 text-sm font-semibold">Net profit</td>
            <td className="py-3.5 px-2 text-right">
              <span
                className={cn(
                  "text-base font-bold tabular-nums",
                  pnl.net_profit >= 0 ? "text-primary" : "text-destructive"
                )}
              >
                {formatMoney(pnl.net_profit, currency)}
              </span>
            </td>
            <td className="py-3.5 pl-2 pr-4 text-right">
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  pnl.net_margin_pct >= 0 ? "text-primary" : "text-destructive"
                )}
              >
                {pnl.net_margin_pct.toFixed(1)}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function PnlRevenueMix({ items, currency, total }: { items: PnLLineItem[]; currency: string; total: number }) {
  if (total <= 0 || items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">No revenue in this period.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((row) => (
        <li key={row.category}>
          <div className="flex items-center justify-between gap-2 text-sm mb-1.5">
            <span className="text-muted-foreground truncate">{row.category}</span>
            <span className="font-medium tabular-nums shrink-0">{formatMoney(row.amount, currency)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.max(row.pct, row.amount > 0 ? 4 : 0)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">{row.pct.toFixed(1)}% of revenue</p>
        </li>
      ))}
    </ul>
  );
}
