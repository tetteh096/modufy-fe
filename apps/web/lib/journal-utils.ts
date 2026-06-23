import type { JournalEntry } from "@/types/api";

export function entryDebitTotal(entry: JournalEntry): number {
  return entry.lines.reduce((sum, line) => sum + (line.debit ?? 0), 0);
}

export function formatJournalDate(iso: string): string {
  return new Date(iso + (iso.includes("T") ? "" : "T12:00:00")).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function journalSummary(entries: JournalEntry[]) {
  const bySource: Record<string, number> = {};
  let totalMovement = 0;

  for (const entry of entries) {
    const key = entry.source_module ?? "manual";
    bySource[key] = (bySource[key] ?? 0) + 1;
    totalMovement += entryDebitTotal(entry);
  }

  return {
    count: entries.length,
    totalMovement,
    bySource,
    lineCount: entries.reduce((n, e) => n + e.lines.length, 0),
  };
}
