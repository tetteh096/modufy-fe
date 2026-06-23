"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Package, Search } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { ProductsListTable } from "@/components/features/inventory/products-list-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

const DEFAULT_PAGE_SIZE = 20;

export default function InventoryProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["inventory", "products", debouncedSearch, page, pageSize],
    queryFn: () =>
      inventoryApi.list({
        type: "product",
        search: debouncedSearch || undefined,
        page,
        limit: pageSize,
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

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages && total > 0) setPage(totalPages);
  }, [page, totalPages, total]);

  return (
    <div>
      <PageHeader
        title="Products"
        description={total > 0 ? `${total} product${total !== 1 ? "s" : ""}` : "Track physical stock"}
        action={
          <Button nativeButton={false} render={<Link href="/inventory/new?type=product" />} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or barcode…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {!isLoading && items.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" />}
              title={search ? "No products found" : "No products yet"}
              description={search ? "Try a different search term." : "Add your first product to start tracking stock."}
              action={
                !search ? (
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
    </div>
  );
}
