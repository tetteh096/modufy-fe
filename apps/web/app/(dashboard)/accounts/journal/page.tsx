"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Plus, Receipt, RefreshCw, ShoppingCart, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { accountsApi } from "@/lib/api";
import { JOURNAL_AUTO_POST_HINTS, type JournalSourceFilter } from "@/lib/journal-constants";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { JournalSourceFilterSelect } from "@/components/features/accounts/journal-source-filter";
import { JournalSummaryStrip } from "@/components/features/accounts/journal-summary-strip";
import { JournalEntryRow } from "@/components/features/accounts/journal-entry-row";
import { JournalNewEntryDialog } from "@/components/features/accounts/journal-new-entry-dialog";
import { JournalOutstandingCard } from "@/components/features/accounts/journal-outstanding-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const QUICK_LINKS = [
  { href: "/sales/new", label: "Record a sale", icon: ShoppingCart },
  { href: "/expenses/new", label: "Log an expense", icon: Receipt },
  { href: "/inventory", label: "Manage stock", icon: Package },
] as const;

export default function JournalPage() {
  const [showNew, setShowNew] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<JournalSourceFilter>("all");
  const autoSyncAttempted = useRef(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["accounts", "journal", sourceFilter],
    queryFn: () =>
      accountsApi.journal.list({
        module: sourceFilter === "all" ? undefined : sourceFilter,
      }),
  });

  const { data: context, isLoading: contextLoading } = useQuery({
    queryKey: ["accounts", "journal", "context"],
    queryFn: () => accountsApi.journal.context(),
  });

  const syncMutation = useMutation({
    mutationFn: () => accountsApi.journal.sync(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["accounts", "journal"] });
      if (result.entries_created > 0) {
        toast.success(`Synced ${result.entries_created} ledger ${result.entries_created === 1 ? "entry" : "entries"} from your transactions`);
      }
    },
    onError: () => {
      toast.error("Could not sync ledger from transactions");
    },
  });

  const entries = data?.entries ?? [];
  const total = data?.total ?? 0;
  const currency = context?.currency ?? entries[0]?.currency ?? "GHS";

  useEffect(() => {
    if (!isFetched || isLoading || autoSyncAttempted.current || syncMutation.isPending) {
      return;
    }
    if (total === 0) {
      autoSyncAttempted.current = true;
      syncMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when list is empty
  }, [isFetched, isLoading, total]);

  const handleSync = () => {
    syncMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal"
        description="Full double-entry ledger for your business"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <JournalSourceFilterSelect value={sourceFilter} onChange={setSourceFilter} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-8"
              onClick={handleSync}
              disabled={syncMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
              Sync ledger
            </Button>
            <Button onClick={() => setShowNew(true)} size="sm" className="gap-1.5 h-8">
              <Plus className="h-4 w-4" />
              New entry
            </Button>
          </div>
        }
      />

      {isLoading || (syncMutation.isPending && entries.length === 0) ? (
        <>
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </>
      ) : (
        <>
          <JournalSummaryStrip entries={entries} currency={currency} />

          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-dashed pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Ledger</CardTitle>
                    <CardDescription>
                      {total === 0
                        ? "No entries yet — sync imports sales, expenses, and invoice activity"
                        : `${total} ${total === 1 ? "entry" : "entries"} · expand to see debit and credit lines`}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {entries.length === 0 ? (
                  <EmptyState
                    icon={<BookOpen className="h-8 w-8" />}
                    title="No journal entries yet"
                    description="Entries are auto-posted when you record sales, log expenses, send invoices, or receive payments. Use Sync ledger to import existing activity."
                    action={
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                          variant="outline"
                          onClick={handleSync}
                          disabled={syncMutation.isPending}
                          className="gap-1.5"
                        >
                          <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
                          Sync ledger
                        </Button>
                        <Button onClick={() => setShowNew(true)} className="gap-1.5">
                          <Plus className="h-4 w-4" />
                          Create manual entry
                        </Button>
                      </div>
                    }
                  />
                ) : (
                  <div>
                    <div className="hidden sm:grid grid-cols-[2rem_1fr_auto_5rem] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground border-b bg-muted/20">
                      <span />
                      <span>Description</span>
                      <span className="text-right">Amount</span>
                      <span className="text-right">Source</span>
                    </div>
                    {entries.map((entry, i) => (
                      <JournalEntryRow key={entry.id} entry={entry} defaultExpanded={i === 0} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <JournalOutstandingCard
                amount={context?.outstanding_receivable ?? 0}
                currency={currency}
                loading={contextLoading}
              />

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">How entries appear</CardTitle>
                  <CardDescription>Automatic posting from your daily work</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {JOURNAL_AUTO_POST_HINTS.map((hint) => (
                    <div key={hint.title} className="rounded-lg border border-border/60 bg-muted/15 px-3 py-3">
                      <p className="text-sm font-medium">{hint.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{hint.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Create activity</CardTitle>
                  <CardDescription>Transactions that generate ledger entries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {QUICK_LINKS.map((link) => (
                    <Button key={link.href} variant="outline" className="w-full justify-start gap-2 h-9" render={<Link href={link.href} />}>
                      <link.icon className="h-4 w-4 text-muted-foreground" />
                      {link.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      <JournalNewEntryDialog open={showNew} onClose={() => setShowNew(false)} />
    </div>
  );
}
