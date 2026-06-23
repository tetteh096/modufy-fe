"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Banknote,
  Receipt,
  Ban,
  Users,
  Store,
  TrendingUp,
  Clock,
} from "lucide-react";
import { posApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney, formatDateTime, todayISO } from "@/lib/format";
import { paymentMethodMeta } from "@/lib/sales-constants";
import { periodRange, type PeriodFilter } from "@/lib/period-range";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { PageHeader } from "@/components/shared/page-header";
import { PeriodFilterTabs } from "@/components/shared/period-filter-tabs";
import { ListPagination } from "@/components/shared/list-pagination";
import { PosTopBar } from "@/components/features/pos/pos-top-bar";
import { SalesTopItems } from "@/components/features/sales/sales-top-items";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PosReceiptView } from "@/components/features/pos/pos-receipt-view";
import type { PosReceipt } from "@/types/api";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

function reportParams(filter: PeriodFilter) {
  const period = periodRange(filter);
  if (filter === "all") {
    return { from: undefined, to: undefined, label: period.label };
  }
  return {
    from: period.from ?? period.chartFrom,
    to: period.to ?? todayISO(),
    label: period.label,
  };
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  loading?: boolean;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-md bg-primary/10 p-2.5 text-primary shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-24 mt-1" />
          ) : (
            <p className="text-lg font-bold tracking-tight truncate">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PosSalesScreen() {
  const qc = useQueryClient();
  const { currency: defaultCurrency } = useDefaultCurrency();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("week");
  const [page, setPage] = useState(1);
  const [receipt, setReceipt] = useState<PosReceipt | null>(null);
  const params = reportParams(periodFilter);

  useEffect(() => {
    setPage(1);
  }, [periodFilter]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["pos-sales-report", periodFilter, params.from, params.to, page],
    queryFn: () =>
      posApi.salesReport({
        from: params.from,
        to: params.to,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      }),
  });

  const voidMutation = useMutation({
    mutationFn: (id: string) => posApi.voidSale(id),
    onSuccess: () => {
      toast.success("Sale voided");
      qc.invalidateQueries({ queryKey: ["pos-sales-report"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  async function showReceipt(saleId: string) {
    try {
      const r = await posApi.receipt(saleId);
      setReceipt(r);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  const summary = data?.summary;
  const currency = summary?.currency ?? defaultCurrency;
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PosTopBar />
      <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 md:p-8">
        <PageHeader
          title="POS sales"
          description="Register performance — totals, staff, shifts, and receipts."
          action={
            <Button nativeButton={false} render={<Link href="/pos/register" />} size="sm" className="gap-1">
              Open register
            </Button>
          }
        />

        <PeriodFilterTabs value={periodFilter} onChange={setPeriodFilter} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title={`Revenue · ${params.label}`}
            value={formatMoney(summary?.total_revenue ?? 0, currency)}
            icon={TrendingUp}
            loading={isLoading}
          />
          <SummaryCard
            title="Sales"
            value={String(summary?.sale_count ?? 0)}
            icon={Receipt}
            loading={isLoading}
          />
          <SummaryCard
            title="Avg ticket"
            value={formatMoney(summary?.avg_ticket ?? 0, currency)}
            icon={Banknote}
            loading={isLoading}
          />
          <SummaryCard
            title="Register shifts"
            value={String(summary?.session_count ?? 0)}
            icon={Store}
            loading={isLoading}
          />
        </div>

        {isLoading ? (
          <SectionLoader />
        ) : (
          <div className={cn("space-y-6", isFetching && "opacity-70 pointer-events-none")}>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Staff sales
                  </CardTitle>
                  <CardDescription>Who rang up sales in {params.label.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {(data?.by_cashier ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No cashier activity in this period.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Staff</TableHead>
                          <TableHead className="text-right">Sales</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.by_cashier.map((row) => (
                          <TableRow key={row.user_id || row.name}>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell className="text-right tabular-nums">{row.sale_count}</TableCell>
                            <TableCell className="text-right tabular-nums font-medium">
                              {formatMoney(row.total, currency)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Top products</CardTitle>
                  <CardDescription>Best sellers at the register</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesTopItems
                    items={(data?.top_products ?? []).map((p) => ({
                      description: p.description,
                      quantity: p.quantity,
                      revenue: p.revenue,
                    }))}
                    currency={currency}
                  />
                </CardContent>
              </Card>
            </div>

            {(data?.by_payment ?? []).length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">By payment method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {data?.by_payment.map((row) => {
                      const pay = paymentMethodMeta(row.payment_method);
                      return (
                        <div
                          key={row.payment_method}
                          className="rounded-lg border px-4 py-3 min-w-[140px]"
                        >
                          <p className="text-xs text-muted-foreground">{pay?.label ?? row.payment_method}</p>
                          <p className="font-semibold tabular-nums">{formatMoney(row.total, currency)}</p>
                          <p className="text-[10px] text-muted-foreground">{row.sale_count} sale{row.sale_count !== 1 ? "s" : ""}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Register shifts
                </CardTitle>
                <CardDescription>Who opened and closed the till, and when</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {(data?.sessions ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8 px-4">
                    No register shifts in this period.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Register</TableHead>
                          <TableHead>Opened by</TableHead>
                          <TableHead>Opened</TableHead>
                          <TableHead>Closed by</TableHead>
                          <TableHead>Closed</TableHead>
                          <TableHead className="text-right">Sales</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.sessions.map((sess) => (
                          <TableRow key={sess.id}>
                            <TableCell className="font-medium">{sess.register_name}</TableCell>
                            <TableCell>{sess.opened_by_name}</TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                              {formatDateTime(sess.opened_at)}
                            </TableCell>
                            <TableCell>{sess.closed_by_name || "—"}</TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                              {sess.closed_at ? formatDateTime(sess.closed_at) : "—"}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{sess.sales_count}</TableCell>
                            <TableCell className="text-right tabular-nums font-medium">
                              {formatMoney(sess.sales_total, currency)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={sess.status === "open" ? "default" : "secondary"}>
                                {sess.status === "open" ? "Open" : "Closed"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">All transactions</CardTitle>
                <CardDescription>
                  {(data?.total ?? 0) > 0
                    ? `${data?.total} receipt${data?.total !== 1 ? "s" : ""} in ${params.label.toLowerCase()}`
                    : "Receipts with time, cashier, and payment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {(data?.sales ?? []).length === 0 ? (
                  <EmptyState
                    icon={<Receipt className="h-8 w-8" />}
                    title={`No POS sales in ${params.label.toLowerCase()}`}
                    description="Completed register checkouts appear here with cashier and timestamp."
                  />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Receipt</TableHead>
                            <TableHead>When</TableHead>
                            <TableHead>Cashier</TableHead>
                            <TableHead>Register</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[140px]" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.sales.map((sale) => {
                            const pay = paymentMethodMeta(sale.payment_method);
                            return (
                              <TableRow key={sale.id}>
                                <TableCell>
                                  <p className="font-medium">{sale.receipt_number || sale.id.slice(0, 8)}</p>
                                  {sale.customer_name ? (
                                    <p className="text-xs text-muted-foreground">{sale.customer_name}</p>
                                  ) : null}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                  {formatDateTime(sale.sale_date)}
                                </TableCell>
                                <TableCell className="text-sm">{sale.cashier_name || "—"}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {sale.register_name || "—"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{pay?.label ?? sale.payment_method}</Badge>
                                </TableCell>
                                <TableCell className="text-right font-semibold tabular-nums">
                                  {formatMoney(sale.total, sale.currency)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => showReceipt(sale.id)}
                                      className="gap-1 h-8"
                                    >
                                      <Receipt className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-destructive h-8"
                                      onClick={() => voidMutation.mutate(sale.id)}
                                      disabled={voidMutation.isPending}
                                      title="Void same-day sale"
                                    >
                                      <Ban className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <ListPagination
                      page={page}
                      pageSize={PAGE_SIZE}
                      total={data?.total ?? 0}
                      onPageChange={setPage}
                      itemLabel="sale"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Receipt · {receipt?.receipt_number}</DialogTitle>
            </DialogHeader>
            {receipt && <PosReceiptView receipt={receipt} />}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => window.print()}>
                Print
              </Button>
              <Button onClick={() => setReceipt(null)}>Done</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
