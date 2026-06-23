"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, FileText, Settings2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { invoicesApi, getApiErrorMessage } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { InvoicesSummaryStrip } from "@/components/features/invoices/invoices-summary-strip";
import { InvoicesToolbar } from "@/components/features/invoices/invoices-toolbar";
import { InvoicesListTable } from "@/components/features/invoices/invoices-list-table";
import {
  computeInvoiceSummary,
  filterInvoicesByStatus,
  type InvoiceStatusFilter,
} from "@/lib/invoice-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { periodRange, type PeriodFilter } from "@/lib/period-range";
import type { InvoiceDocType } from "@/types/api";

function ListSkeleton() {
  return (
    <div className="divide-y">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-5">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function InvoicesPage() {
  const { currency } = useDefaultCurrency();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | InvoiceDocType>("all");
  const [period, setPeriod] = useState<PeriodFilter>("last30");
  const queryClient = useQueryClient();

  const range = periodRange(period);

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["invoices", "stats", period, typeFilter],
    queryFn: () =>
      invoicesApi.list({
        limit: 500,
        type: typeFilter !== "all" ? typeFilter : undefined,
        from: range.from,
        to: range.to,
      }),
  });

  const apiStatus =
    statusFilter === "all" || statusFilter === "collect" ? undefined : statusFilter;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["invoices", statusFilter, typeFilter, period],
    queryFn: () =>
      invoicesApi.list({
        limit: 100,
        status: apiStatus,
        type: typeFilter !== "all" ? typeFilter : undefined,
        from: range.from,
        to: range.to,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: invoicesApi.delete,
    onSuccess: () => {
      toast.success("Draft deleted");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const sendMutation = useMutation({
    mutationFn: (invoiceId: string) => invoicesApi.send(invoiceId),
    onSuccess: (res) => {
      const link = res.whatsapp_link;
      toast.success("Invoice sent", {
        description: res.message,
        action: link
          ? { label: "Open WhatsApp", onClick: () => window.open(link) }
          : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const statsInvoices = statsData?.invoices ?? [];
  const summary = useMemo(() => computeInvoiceSummary(statsInvoices), [statsInvoices]);

  const rawInvoices = data?.invoices ?? [];
  const invoices = useMemo(
    () => filterInvoicesByStatus(rawInvoices, statusFilter),
    [rawInvoices, statusFilter]
  );

  const displayCurrency =
    invoices[0]?.currency ?? statsInvoices[0]?.currency ?? currency;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Invoices, quotes, and proformas — track what's sent, paid, and still to collect."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              render={<Link href="/settings/invoices" />}
              variant="outline"
              size="sm"
              className="gap-1.5 h-8"
            >
              <Settings2 className="h-4 w-4" />
              Appearance
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button size="sm" className="gap-1.5 h-8">
                    <Plus className="h-4 w-4" />
                    Create
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href="/invoices/new" />}>
                  New invoice
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/invoices/new?type=quote" />}>
                  New quote
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/invoices/new?type=proforma" />}>
                  New proforma
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <InvoicesSummaryStrip
        summary={summary}
        currency={displayCurrency}
        periodLabel={range.label}
        loading={statsLoading}
      />

      <Card className="shadow-sm overflow-hidden">
        <InvoicesToolbar
          period={period}
          onPeriodChange={setPeriod}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusCounts={summary.byStatus}
          collectCount={summary.outstandingCount}
        />

        <CardContent className="p-0">
          {isLoading ? (
            <ListSkeleton />
          ) : invoices.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-8 w-8" />}
              title={
                statusFilter === "collect"
                  ? "Nothing to collect"
                  : "No documents in this range"
              }
              description={
                statusFilter === "collect"
                  ? "All invoices in this period are paid or still drafts."
                  : "Try a wider date range or create a new invoice, quote, or proforma."
              }
              action={
                <Button render={<Link href="/invoices/new" />} size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  New invoice
                </Button>
              }
            />
          ) : (
            <>
              {isFetching && !isLoading && (
                <p className="text-[11px] text-muted-foreground px-5 py-2 border-b bg-muted/20">
                  Updating…
                </p>
              )}
              <InvoicesListTable
                invoices={invoices}
                onDelete={(id) => deleteMutation.mutate(id)}
                onSend={(id) => sendMutation.mutate(id)}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
