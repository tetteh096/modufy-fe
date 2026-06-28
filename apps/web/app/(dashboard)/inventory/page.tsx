"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowUpDown, Filter, Package, Plus, Search } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { useDebounce } from "@/hooks/use-debounce";
import {
  filterProductsByStock,
  paginateItems,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_STOCK_FILTER_OPTIONS,
  sortProducts,
  type ProductSortKey,
  type ProductStockFilter,
} from "@/lib/inventory-product-list";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { ProductsListTable } from "@/components/features/inventory/products-list-table";
import { ProductsStatsOverview } from "@/components/features/inventory/products-stats-overview";
import { ProductQuickAdjustSheet } from "@/components/features/inventory/product-quick-adjust-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InventoryItem } from "@/types/api";

const DEFAULT_PAGE_SIZE = 20;
const CATALOG_FETCH_LIMIT = 500;

export default function InventoryProductsPage() {
  const { currency } = useDefaultCurrency();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<ProductStockFilter>("all");
  const [sortKey, setSortKey] = useState<ProductSortKey>("name_asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize, categoryFilter, statusFilter, stockFilter, sortKey]);

  const { data: categoriesData } = useQuery({
    queryKey: ["inventory-categories", "product"],
    queryFn: () => inventoryApi.listCategories("product"),
  });

  const { data: valuation, isLoading: valuationLoading } = useQuery({
    queryKey: ["inventory", "valuation"],
    queryFn: inventoryApi.valuation,
  });

  const { data: lowStockData } = useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: inventoryApi.lowStock,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "inventory",
      "products",
      debouncedSearch,
      categoryFilter,
      statusFilter,
    ],
    queryFn: () =>
      inventoryApi.list({
        type: "product",
        search: debouncedSearch || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: CATALOG_FETCH_LIMIT,
        page: 1,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryApi.delete,
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const allItems = data?.items ?? [];
  const categories = categoriesData?.categories ?? [];

  const processedItems = useMemo(() => {
    const filtered = filterProductsByStock(allItems, stockFilter);
    return sortProducts(filtered, sortKey);
  }, [allItems, stockFilter, sortKey]);

  const total = processedItems.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const items = paginateItems(processedItems, page, pageSize);

  const activeCount = allItems.filter((item) => item.status === "active").length;
  const lowStockCount = lowStockData?.items?.length ?? allItems.filter((item) => item.is_low_stock).length;

  useEffect(() => {
    if (page > totalPages && total > 0) setPage(totalPages);
  }, [page, totalPages, total]);

  useEffect(() => {
    if (!adjustItem) return;
    const fresh = allItems.find((item) => item.id === adjustItem.id);
    if (fresh) setAdjustItem(fresh);
  }, [allItems, adjustItem?.id]);

  const hasFilters =
    Boolean(debouncedSearch) ||
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    stockFilter !== "all" ||
    sortKey !== "name_asc";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Products"
        description="Track stock, adjust prices, and spot low inventory fast"
        action={
          <Button nativeButton={false} render={<Link href="/inventory/new?type=product" />} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        }
      />

      <ProductsStatsOverview
        totalProducts={data?.total ?? allItems.length}
        activeProducts={activeCount}
        lowStockCount={lowStockCount}
        categoryCount={categories.length}
        stockValue={valuation?.total_cost_value ?? 0}
        currency={currency}
        loading={isLoading || valuationLoading}
      />

      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Product catalogue
              </CardTitle>
              <CardDescription>
                {total > 0
                  ? `${total} product${total !== 1 ? "s" : ""} matching filters`
                  : "Search, filter, and quick-adjust stock without leaving the list"}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as ProductStockFilter)}>
                <SelectTrigger className="h-9 w-[130px]">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_STOCK_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select value={sortKey} onValueChange={(v) => setSortKey(v as ProductSortKey)}>
                <SelectTrigger className="h-9 w-[150px]">
                  <ArrowUpDown className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
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
                placeholder="Search by name, SKU, or barcode…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Filter className="h-3.5 w-3.5" />
              Use Adjust or the ⋮ menu on each row
            </p>
          </div>

          {!isLoading && items.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" />}
              title={hasFilters ? "No products found" : "No products yet"}
              description={
                hasFilters
                  ? "Try a different search or filter."
                  : "Add your first product to start tracking stock."
              }
              action={
                !hasFilters ? (
                  <Button nativeButton={false} render={<Link href="/inventory/new?type=product" />} size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Add first product
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className={isFetching && !isLoading ? "opacity-60 transition-opacity" : undefined}>
                <ProductsListTable
                  items={items}
                  isLoading={isLoading}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onQuickAdjust={setAdjustItem}
                />
              </div>
              <ListPagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                itemLabel="product"
              />
            </>
          )}
        </CardContent>
      </Card>

      <ProductQuickAdjustSheet
        item={adjustItem}
        open={Boolean(adjustItem)}
        onOpenChange={(open) => {
          if (!open) setAdjustItem(null);
        }}
      />
    </div>
  );
}
