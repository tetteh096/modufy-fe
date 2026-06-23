"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/format";
import { JOURNAL_SOURCE_META } from "@/lib/journal-constants";
import { entryDebitTotal, formatJournalDate } from "@/lib/journal-utils";
import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/types/api";

type JournalEntryRowProps = {
  entry: JournalEntry;
  defaultExpanded?: boolean;
};

export function JournalEntryRow({ entry, defaultExpanded = false }: JournalEntryRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const sourceKey = entry.source_module ?? "manual";
  const source = JOURNAL_SOURCE_META[sourceKey] ?? JOURNAL_SOURCE_META.manual;
  const total = entryDebitTotal(entry);

  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 sm:gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>

        <div className="flex-1 min-w-0 grid gap-0.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{entry.description}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatJournalDate(entry.date)} · {entry.lines.length} lines
            </p>
          </div>
          <p className="text-sm font-semibold tabular-nums sm:text-right">
            {formatMoney(total, entry.currency)}
          </p>
        </div>

        <Badge variant="outline" className={cn("text-[10px] shrink-0 hidden sm:inline-flex", source.className)}>
          {source.label}
        </Badge>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pl-14 sm:pl-16 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="overflow-x-auto rounded-lg border bg-muted/10">
            <table className="w-full min-w-[18rem] text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b bg-muted/20">
                  <th className="text-left py-2 px-3 font-medium">Account</th>
                  <th className="text-right py-2 px-3 font-medium w-28">Debit</th>
                  <th className="text-right py-2 px-3 font-medium w-28">Credit</th>
                </tr>
              </thead>
              <tbody>
                {entry.lines.map((line) => (
                  <tr key={line.id} className="border-b border-border/40 last:border-0">
                    <td className="py-2 px-3 pr-4">
                      <span className="font-mono text-[11px] text-muted-foreground mr-2">
                        {line.account_code}
                      </span>
                      <span>{line.account_name}</span>
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-sm">
                      {line.debit > 0 ? formatMoney(line.debit, entry.currency) : "—"}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-sm">
                      {line.credit > 0 ? formatMoney(line.credit, entry.currency) : "—"}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/25 font-medium">
                  <td className="py-2 px-3 text-xs text-muted-foreground">Totals</td>
                  <td className="py-2 px-3 text-right tabular-nums text-xs">
                    {formatMoney(total, entry.currency)}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-xs">
                    {formatMoney(total, entry.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
