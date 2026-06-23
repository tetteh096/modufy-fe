"use client";

import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { VATSummary } from "@/types/api";

type TaxKpiStripProps = {
  summary: VATSummary;
  loading?: boolean;
};

export function TaxKpiStrip({ summary, loading }: TaxKpiStripProps) {
  const { currency } = summary;
  const items = [
    {
      label: "VAT (15%)",
      value: formatMoney(summary.vat_collected, currency),
      className: "text-primary",
    },
    {
      label: "NHIL (2.5%)",
      value: formatMoney(summary.nhil_collected, currency),
      className: "text-amber-700 dark:text-amber-400",
    },
    {
      label: "GETFund (2.5%)",
      value: formatMoney(summary.getfund_collected, currency),
      className: "text-violet-700 dark:text-violet-400",
    },
    {
      label: "Net payable",
      value: formatMoney(summary.net_vat_payable, currency),
      className: "text-foreground",
    },
  ];

  return (
    <div className="rounded-xl border border-primary/10 bg-primary/[0.04] dark:bg-primary/[0.07] overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            {loading ? (
              <div className="mt-2 mx-auto h-7 w-24 animate-pulse rounded bg-muted/50" />
            ) : (
              <p className={cn("mt-1.5 text-lg font-bold tabular-nums tracking-tight", item.className)}>
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
