"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  ShoppingCart,
  TrendingUp,
  Banknote,
  ArrowDownUp,
  BarChart3,
  PieChart,
  Package,
  Info,
  Search,
  Filter,
} from "lucide-react";
import { salesApi, getApiErrorMessage } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { useDebounce } from "@/hooks/use-debounce";
import { SALE_PAYMENT_METHODS } from "@/lib/sales-constants";
import { SALE_SOURCE_OPTIONS, type SaleSourceFilter } from "@/lib/sale-source";
import { formatMoney } from "@/lib/format";
import { periodRange, type PeriodFilter } from "@/lib/period-range";
import { PageHeader } from "@/components/shared/page-header";
import { PeriodFilterTabs } from "@/components/shared/period-filter-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { SalesRevenueChart } from "@/components/features/sales/sales-revenue-chart";
import { SalesPaymentChart } from "@/components/features/sales/sales-payment-chart";
import { SalesTopItems } from "@/components/features/sales/sales-top-items";
import { SalesListTable } from "@/components/features/sales/sales-list-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_PAGE_SIZE = 20;

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
      <CardContent className="flex items-center gap-4 p-5 md:p-6">
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

export default function SalesPage() {
  const searchParams = useSearchParams();
  const initialSource = searchParams.get("source");
  const { currency: defaultCurrency } = useDefaultCurrency();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("today");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState<SaleSourceFilter>(
    initialSource === "pos" ? "pos" : "all"
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();
  const period = periodRange(periodFilter);

  useEffect(() => {
    setPage(1);
  }, [periodFilter, paymentFilter, sourceFilter, debouncedSearch, pageSize]);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["sales-summary", periodFilter, period.from, period.to],
    queryFn: () => salesApi.summary(period.summaryParams),
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ["sales-trends", period.chartFrom, period.chartTo],
    queryFn: () =>
      salesApi.trends({ from: period.chartFrom, to: period.chartTo }),
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "sales",
      periodFilter,
      paymentFilter,
      sourceFilter,
      debouncedSearch,
      page,
      pageSize,
      period.from,
      period.to,
    ],
    queryFn: () =>
      salesApi.list({
        from: period.from,
        to: period.to,
        page,
        limit: pageSize,
        payment_method: paymentFilter === "all" ? undefined : paymentFilter,
        source_type: sourceFilter === "all" ? undefined : sourceFilter,
        search: debouncedSearch || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: salesApi.delete,
    onSuccess: () => {
      toast.success("Sale deleted");
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      queryClient.invalidateQueries({ queryKey: ["sales-trends"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const sales = data?.sales ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const periodLabel = period.label.toLowerCase();

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="w-full max-w-6xl space-y-8">
      <PageHeader
        title="Sales"
        description="Track money in — cash, MoMo, and bank. No invoice needed for quick sales."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/sales/new" />}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Record sale
          </Button>
        }
      />

      <PeriodFilterTabs value={periodFilter} onChange={setPeriodFilter} />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title={`Revenue · ${period.label}`}
          value={formatMoney(summary?.total_revenue ?? 0, defaultCurrency)}
          icon={TrendingUp}
          loading={summaryLoading}
        />
        <SummaryCard
          title={`Expenses · ${period.label}`}
          value={formatMoney(summary?.total_expenses ?? 0, defaultCurrency)}
          icon={Banknote}
          loading={summaryLoading}
        />
        <SummaryCard
          title={`Net · ${period.label}`}
          value={formatMoney(summary?.net_position ?? 0, defaultCurrency)}
          icon={ArrowDownUp}
          loading={summaryLoading}
        />
        {!summaryLoading && (summary?.transaction_count ?? 0) > 0 && (
          <p className="text-xs text-muted-foreground sm:col-span-3 -mt-2">
            {summary?.transaction_count} sale
            {summary?.transaction_count !== 1 ? "s" : ""} in {periodLabel}
            {(summary?.net_position ?? 0) >= 0
              ? " · cash in ahead of spend"
              : " · spend ahead of cash in"}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              {period.chartSubtitle}
            </CardTitle>
            <CardDescription>Revenue trend in your default currency</CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            {trendsLoading ? (
              <Skeleton className="h-[148px] w-full" />
            ) : (
              <SalesRevenueChart
                data={trends?.data ?? []}
                currency={defaultCurrency}
              />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              {period.label} by payment
            </CardTitle>
            <CardDescription>Cash, MoMo, card, and bank split</CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            {summaryLoading ? (
              <Skeleton className="h-[120px] w-full" />
            ) : (
              <SalesPaymentChart
                byMethod={summary?.by_payment_method ?? {}}
                currency={defaultCurrency}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {(summaryLoading || (summary?.top_items?.length ?? 0) > 0) && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Top sellers · {period.label}
            </CardTitle>
            <CardDescription>From line items in this period</CardDescription>
          </CardHeader>
          <CardContent className="pb-5 max-w-xl">
            {summaryLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <SalesTopItems
                items={summary?.top_items ?? []}
                currency={defaultCurrency}
              />
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
        <p>
          Quick sales and <strong className="font-medium text-foreground">POS register</strong> checkouts
          all land here — search by receipt number (e.g. RCP-2026-00001). Posted to{" "}
          <strong className="font-medium text-foreground">Accounts</strong> automatically when that module is on.{" "}
          Full POS shift reports live under{" "}
          <Link href="/pos/sales" className="text-primary hover:underline font-medium">
            POS sales
          </Link>
          .
        </p>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 md:p-5 border-b">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-medium text-foreground">
                Sales · {period.label}
              </p>
              {total > 0 && (
                <Badge variant="secondary" className="w-fit tabular-nums">
                  {total} sale{total !== 1 ? "s" : ""} in this view
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search receipt, description, or customer…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select
                value={sourceFilter}
                onValueChange={(v) => v && setSourceFilter(v as SaleSourceFilter)}
              >
                <SelectTrigger className="w-full sm:w-[160px] h-9">
                  <SelectValue placeholder="All channels" />
                </SelectTrigger>
                <SelectContent>
                  {SALE_SOURCE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={paymentFilter}
                onValueChange={(v) => v && setPaymentFilter(v)}
              >
                <SelectTrigger className="w-full sm:w-[200px] h-9">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="All payment methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All payment methods</SelectItem>
                  {SALE_PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sales.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className="h-8 w-8" />}
              title={
                debouncedSearch || paymentFilter !== "all" || sourceFilter !== "all"
                  ? "No matching sales"
                  : periodFilter === "all"
                    ? "No sales yet"
                    : `No sales in ${periodLabel}`
              }
              description="Record a sale when you receive payment — cash, MoMo, or card."
              action={
                <Button
                  nativeButton={false}
                  render={<Link href="/sales/new" />}
                  size="sm"
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Record sale
                </Button>
              }
            />
          ) : (
            <>
              <div className={isFetching && !isLoading ? "opacity-60 pointer-events-none" : ""}>
                <SalesListTable
                  sales={sales}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              </div>
              <ListPagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                itemLabel="sale"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
