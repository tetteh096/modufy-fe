"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  CreditCard,
  Banknote,
  TrendingDown,
  ArrowDownUp,
  BarChart3,
  PieChart,
  Search,
  Filter,
} from "lucide-react";
import { expensesApi, salesApi, getApiErrorMessage } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { useDebounce } from "@/hooks/use-debounce";
import { EXPENSE_CATEGORIES } from "@/lib/expense-constants";
import { formatMoney } from "@/lib/format";
import { periodRange, type PeriodFilter } from "@/lib/period-range";
import { PageHeader } from "@/components/shared/page-header";
import { PeriodFilterTabs } from "@/components/shared/period-filter-tabs";
import { BranchReportFilter, branchApiParams } from "@/components/features/branches/branch-report-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { ExpensesListTable } from "@/components/features/expenses/expenses-list-table";
import { ExpensesTrendChart } from "@/components/features/expenses/expenses-trend-chart";
import { ExpenseCategoryChart } from "@/components/features/expenses/expense-category-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE = 20;

function SummaryCard({
  title,
  value,
  icon: Icon,
  loading,
  accent,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  loading?: boolean;
  accent?: "orange" | "primary";
}) {
  const iconClass =
    accent === "orange"
      ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
      : "bg-primary/10 text-primary";

  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-5 md:p-6">
        <div className={cn("rounded-md p-2.5 shrink-0", iconClass)}>
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

export default function ExpensesPage() {
  const { currency: defaultCurrency } = useDefaultCurrency();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("week");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [branchFilter, setBranchFilter] = useState("all");
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();
  const period = periodRange(periodFilter);
  const branchParams = branchApiParams(branchFilter);
  const periodLabel = period.label.toLowerCase();

  useEffect(() => {
    setPage(1);
  }, [periodFilter, categoryFilter, debouncedSearch, pageSize, branchFilter]);

  const { data: expenseSummary, isLoading: expenseSummaryLoading } = useQuery({
    queryKey: ["expenses-summary", periodFilter, period.from, period.to, branchFilter],
    queryFn: () => expensesApi.summary({ ...period.summaryParams, ...branchParams }),
  });

  const { data: salesSummary, isLoading: salesSummaryLoading } = useQuery({
    queryKey: ["sales-summary", periodFilter, period.from, period.to, branchFilter],
    queryFn: () => salesApi.summary({ ...period.summaryParams, ...branchParams }),
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ["expenses-trends", period.chartFrom, period.chartTo, branchFilter],
    queryFn: () =>
      expensesApi.trends({ from: period.chartFrom, to: period.chartTo, ...branchParams }),
  });

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [
      "expenses",
      periodFilter,
      categoryFilter,
      debouncedSearch,
      page,
      pageSize,
      period.from,
      period.to,
      branchFilter,
    ],
    queryFn: () =>
      expensesApi.list({
        from: period.from,
        to: period.to,
        page,
        limit: pageSize,
        category:
          categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined,
        search: debouncedSearch || undefined,
        ...branchParams,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: expensesApi.delete,
    onSuccess: () => {
      toast.success("Expense deleted");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-trends"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const expenses = data?.expenses ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const spent = expenseSummary?.total_expenses ?? 0;
  const revenue = salesSummary?.total_revenue ?? 0;
  const net = revenue - spent;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="Expenses"
        description="Track money out — rent, stock, transport, and running costs."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/expenses/new" />}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Log expense
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PeriodFilterTabs value={periodFilter} onChange={setPeriodFilter} />
        <BranchReportFilter value={branchFilter} onChange={setBranchFilter} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title={`Spent · ${period.label}`}
          value={formatMoney(spent, defaultCurrency)}
          icon={TrendingDown}
          loading={expenseSummaryLoading}
          accent="orange"
        />
        <SummaryCard
          title={`Revenue · ${period.label}`}
          value={formatMoney(revenue, defaultCurrency)}
          icon={Banknote}
          loading={salesSummaryLoading}
        />
        <SummaryCard
          title={`Net · ${period.label}`}
          value={formatMoney(net, defaultCurrency)}
          icon={ArrowDownUp}
          loading={expenseSummaryLoading || salesSummaryLoading}
        />
        {!expenseSummaryLoading && (expenseSummary?.transaction_count ?? 0) > 0 && (
          <p className="text-xs text-muted-foreground sm:col-span-3 -mt-2">
            {expenseSummary?.transaction_count} expense
            {expenseSummary?.transaction_count !== 1 ? "s" : ""} in {periodLabel}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              {period.chartSubtitle}
            </CardTitle>
            <CardDescription>Spending trend in your default currency</CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            {trendsLoading ? (
              <Skeleton className="h-[148px] w-full" />
            ) : (
              <ExpensesTrendChart
                data={trends?.data ?? []}
                currency={defaultCurrency}
              />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              {period.label} by category
            </CardTitle>
            <CardDescription>Where money went in this period</CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            {expenseSummaryLoading ? (
              <Skeleton className="h-[120px] w-full" />
            ) : (
              <ExpenseCategoryChart
                byCategory={expenseSummary?.by_category ?? {}}
                currency={defaultCurrency}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 md:p-5 border-b">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <p className="text-sm font-medium text-foreground">
                Expenses · {period.label}
              </p>
              {total > 0 && (
                <Badge variant="secondary" className="tabular-nums">
                  {total} expense{total !== 1 ? "s" : ""} in this view
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search notes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v ?? "all")}
              >
                <SelectTrigger className="w-full sm:w-[200px] h-9">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isError ? (
            <div className="p-6 text-center text-sm text-destructive">
              Could not load expenses. {getApiErrorMessage(error)}
            </div>
          ) : isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <EmptyState
              icon={<CreditCard className="h-8 w-8" />}
              title={
                debouncedSearch || categoryFilter !== "all"
                  ? "No matching expenses"
                  : periodFilter === "all"
                    ? "No expenses yet"
                    : `No expenses in ${periodLabel}`
              }
              description={
                periodFilter === "today" &&
                (trends?.data?.some((d) => d.total > 0) ?? false)
                  ? "You have spending on other days — try a wider period."
                  : "Log rent, supplies, transport, and other costs to see your net position on Sales."
              }
              action={
                <Button
                  nativeButton={false}
                  render={<Link href="/expenses/new" />}
                  size="sm"
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Log expense
                </Button>
              }
            />
          ) : (
            <>
              <div className={isFetching && !isLoading ? "opacity-60 pointer-events-none" : ""}>
                <ExpensesListTable
                  expenses={expenses}
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
                itemLabel="expense"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
