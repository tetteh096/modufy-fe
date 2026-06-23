"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package, Plus, Search } from "lucide-react";
import { inventoryApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { StorefrontProductsTable } from "@/components/features/marketplace/storefront-products-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

const DEFAULT_PAGE_SIZE = 10;

export default function MarketplaceProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["inventory-products-storefront", debouncedSearch, page, pageSize],
    queryFn: () =>
      inventoryApi.list({
        type: "product",
        search: debouncedSearch || undefined,
        page,
        limit: pageSize,
      }),
  });

  const { data: statsData } = useQuery({
    queryKey: ["inventory-products-storefront-stats"],
    queryFn: () => inventoryApi.list({ type: "product", limit: 200 }),
    staleTime: 30_000,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const allProducts = statsData?.items ?? [];
  const visibleTotal = allProducts.filter((p) => p.storefront_visible).length;
  const catalogTotal = statsData?.total ?? total;

  useEffect(() => {
    if (page > totalPages && total > 0) setPage(totalPages);
  }, [page, totalPages, total]);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Products on storefront"
        description="Toggle which products are visible to customers"
        action={
          <Button nativeButton={false} render={<Link href="/inventory/new?type=product" />} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        }
      />

      <Card>
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
            <p className="text-sm text-muted-foreground tabular-nums shrink-0">
              {visibleTotal} of {catalogTotal} visible on storefront
            </p>
          </div>

          {!isLoading && items.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" />}
              title={search ? "No products found" : "No products yet"}
              description={
                search
                  ? "Try a different search term."
                  : "Add products to your inventory to show them on your storefront"
              }
              action={
                !search ? (
                  <Button nativeButton={false} render={<Link href="/inventory/new?type=product" />} size="sm">
                    Add first product
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className={isFetching && !isLoading ? "opacity-60 transition-opacity" : undefined}>
                <StorefrontProductsTable items={items} isLoading={isLoading} />
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
    </div>
  );
}
