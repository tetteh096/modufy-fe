"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BarChart3, Filter, Layers, Plus, TrendingUp, Wrench, Search } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { useDebounce } from "@/hooks/use-debounce";
import { periodRange, type PeriodFilter } from "@/lib/period-range";
import { PageHeader } from "@/components/shared/page-header";
import { PeriodFilterTabs } from "@/components/shared/period-filter-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { ServicesListTable } from "@/components/features/inventory/services-list-table";
import { ServicesStatsOverview } from "@/components/features/inventory/services-stats-overview";
import { ServicesTopBooked } from "@/components/features/inventory/services-top-booked";
import { ServicesCategoryBreakdown } from "@/components/features/inventory/services-category-breakdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_PAGE_SIZE = 20;

export default function InventoryServicesPage() {
  const { currency } = useDefaultCurrency();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("last30");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [bookableFilter, setBookableFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();
  const period = periodRange(periodFilter);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize, categoryFilter, statusFilter, visibilityFilter, bookableFilter]);

  const { data: categoriesData } = useQuery({
    queryKey: ["inventory-categories", "service"],
    queryFn: () => inventoryApi.listCategories("service"),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["inventory-service-stats", periodFilter, period.from, period.to],
    queryFn: () =>
      inventoryApi.serviceStats({
        from: period.from,
        to: period.to,
      }),
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "inventory",
      "services",
      debouncedSearch,
      categoryFilter,
      statusFilter,
      visibilityFilter,
      bookableFilter,
      page,
      pageSize,
    ],
    queryFn: () =>
      inventoryApi.list({
        type: "service",
        search: debouncedSearch || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        storefront_visible:
          visibilityFilter === "public" ? true : visibilityFilter === "hidden" ? false : undefined,
        is_bookable: bookableFilter === "yes" ? true : bookableFilter === "no" ? false : undefined,
        page,
        limit: pageSize,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryApi.delete,
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-service-stats"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const categories = categoriesData?.categories ?? [];

  useEffect(() => {
    if (page > totalPages && total > 0) setPage(totalPages);
  }, [page, totalPages, total]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Services"
        description="Manage your service catalogue, bookings, and storefront visibility"
        action={
          <Button nativeButton={false} render={<Link href="/inventory/new?type=service" />} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add service
          </Button>
        }
      />

      <PeriodFilterTabs value={periodFilter} onChange={setPeriodFilter} />

      <ServicesStatsOverview stats={stats} loading={statsLoading} currency={currency} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Most booked · {stats?.period_label ?? period.label}
            </CardTitle>
            <CardDescription>What customers schedule most often</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ServicesTopBooked items={stats?.top_by_bookings ?? []} currency={currency} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              By category
            </CardTitle>
            <CardDescription>How your catalogue is grouped</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <ServicesCategoryBreakdown items={stats?.by_category ?? []} currency={currency} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Service catalogue
              </CardTitle>
              <CardDescription>
                {total > 0 ? `${total} service${total !== 1 ? "s" : ""} matching filters` : "Filter and manage your services"}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as string)}>
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as string)}>
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
              <Select value={visibilityFilter} onValueChange={(v) => setVisibilityFilter(v as string)}>
                <SelectTrigger className="h-9 w-[130px]">
                  <SelectValue placeholder="Storefront" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All visibility</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
              <Select value={bookableFilter} onValueChange={(v) => setBookableFilter(v as string)}>
                <SelectTrigger className="h-9 w-[130px]">
                  <SelectValue placeholder="Booking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All booking</SelectItem>
                  <SelectItem value="yes">Bookable</SelectItem>
                  <SelectItem value="no">Not bookable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Filter className="h-3.5 w-3.5" />
              Filters apply to the table below
            </p>
          </div>

          {!isLoading && items.length === 0 ? (
            <EmptyState
              icon={<Wrench className="h-8 w-8" />}
              title={search || categoryFilter !== "all" ? "No services found" : "No services yet"}
              description={
                search || categoryFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Add your first service — it will appear on invoices, bookings, and your storefront."
              }
              action={
                !search && categoryFilter === "all" ? (
                  <Button nativeButton={false} render={<Link href="/inventory/new?type=service" />} size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Add first service
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className={isFetching && !isLoading ? "opacity-60 transition-opacity" : undefined}>
                <ServicesListTable
                  items={items}
                  isLoading={isLoading}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              </div>
              <ListPagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                itemLabel="service"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
