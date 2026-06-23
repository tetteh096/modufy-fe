"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search, Users } from "lucide-react";
import { customersApi, getApiErrorMessage } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { useDebounce } from "@/hooks/use-debounce";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { CustomersSummaryCards } from "@/components/features/customers/customers-summary-cards";
import { CustomersListTable } from "@/components/features/customers/customers-list-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEFAULT_PAGE_SIZE = 20;
const STATS_LIMIT = 500;

type BalanceFilter = "all" | "owing";

export default function CustomersPage() {
  const { currency } = useDefaultCurrency();
  const [search, setSearch] = useState("");
  const [balanceFilter, setBalanceFilter] = useState<BalanceFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, balanceFilter, pageSize]);

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["customers", "stats"],
    queryFn: () => customersApi.list({ limit: STATS_LIMIT }),
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["customers", debouncedSearch, balanceFilter, page, pageSize],
    queryFn: () =>
      customersApi.list({
        search: debouncedSearch || undefined,
        page,
        limit: pageSize,
        owes_only: balanceFilter === "owing",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      toast.success("Customer deleted");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const stats = useMemo(() => {
    const list = statsData?.customers ?? [];
    return {
      total: statsData?.total ?? list.length,
      companyCount: list.filter((c) => c.customer_type === "company").length,
      owingCount: list.filter((c) => c.total_owed > 0).length,
      totalOwed: list.reduce((s, c) => s + c.total_owed, 0),
      reachableCount: list.filter((c) => c.phone || c.email).length,
    };
  }, [statsData]);

  const customers = data?.customers ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="Customers"
        description="People you sell to — track contact info, sales, invoices, and balances."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/customers/new" />}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add customer
          </Button>
        }
      />

      <CustomersSummaryCards
        total={stats.total}
        companyCount={stats.companyCount}
        owingCount={stats.owingCount}
        totalOwed={stats.totalOwed}
        reachableCount={stats.reachableCount}
        currency={currency}
        loading={statsLoading}
      />

      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 md:p-5 border-b">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs
                value={balanceFilter}
                onValueChange={(v) => setBalanceFilter(v as BalanceFilter)}
              >
                <TabsList>
                  <TabsTrigger value="all">All customers</TabsTrigger>
                  <TabsTrigger value="owing">Owing balance</TabsTrigger>
                </TabsList>
              </Tabs>
              {total > 0 && (
                <Badge variant="secondary" className="w-fit tabular-nums">
                  {total} in this view
                </Badge>
              )}
            </div>

            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search name, company, phone, email, or contact person…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <EmptyState
              icon={<Users className="h-8 w-8" />}
              title={
                debouncedSearch || balanceFilter === "owing"
                  ? "No matching customers"
                  : "No customers yet"
              }
              description={
                debouncedSearch
                  ? `No results for "${debouncedSearch}". Try another name or phone.`
                  : balanceFilter === "owing"
                    ? "No customers with an outstanding balance right now."
                    : "Add your first customer to link sales, invoices, and track what they owe."
              }
              action={
                !debouncedSearch && balanceFilter === "all" ? (
                  <Button
                    nativeButton={false}
                    render={<Link href="/customers/new" />}
                    size="sm"
                    className="gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add your first customer
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className={isFetching && !isLoading ? "opacity-60 pointer-events-none" : ""}>
                <CustomersListTable
                  customers={customers}
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
                itemLabel="customer"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
