"use client";

import { formatMoney } from "@/lib/format";
import { JOURNAL_SOURCE_META } from "@/lib/journal-constants";
import { journalSummary } from "@/lib/journal-utils";
import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/types/api";

type JournalSummaryStripProps = {
  entries: JournalEntry[];
  currency?: string;
  loading?: boolean;
};

export function JournalSummaryStrip({ entries, currency = "GHS", loading }: JournalSummaryStripProps) {
  const summary = journalSummary(entries);

  const items = [
    { label: "Entries", value: String(summary.count) },
    { label: "Lines", value: String(summary.lineCount) },
    {
      label: "Total posted",
      value: formatMoney(summary.totalMovement, currency),
      className: "text-foreground",
    },
    {
      label: "Auto-posted",
      value: String(
        (summary.bySource.sales ?? 0) +
          (summary.bySource.invoices ?? 0) +
          (summary.bySource.expenses ?? 0) +
          (summary.bySource.inventory ?? 0) +
          (summary.bySource.appointments ?? 0)
      ),
    },
    {
      label: "Manual",
      value: String(summary.bySource.manual ?? 0),
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
              <div className="mt-2 mx-auto h-7 w-16 animate-pulse rounded bg-muted/50" />
            ) : (
              <p className={cn("mt-1.5 text-lg font-bold tabular-nums tracking-tight", item.className)}>
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {!loading && summary.count > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border/60 bg-background/40">
          {Object.entries(summary.bySource).map(([source, count]) => {
            const meta = JOURNAL_SOURCE_META[source] ?? JOURNAL_SOURCE_META.manual;
            return (
              <span
                key={source}
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                  meta.className
                )}
              >
                {meta.label} · {count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
