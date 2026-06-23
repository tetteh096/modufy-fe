"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { MarketplaceOrdersTable } from "@/components/features/marketplace/marketplace-orders-table";
import { MarketplaceOrderDetailPanel } from "@/components/features/marketplace/marketplace-order-detail-panel";
import { ORDER_STATUS_CONFIG } from "@/components/features/marketplace/marketplace-order-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketplaceOrder, OrderStatus } from "@/types/api";
import type { OrdersQueryFilters } from "@/lib/orders-filters";
import { ordersListParams } from "@/lib/orders-filters";

const DEFAULT_PAGE_SIZE = 20;

type MarketplaceOrdersSectionProps = {
  queryFilters: OrdersQueryFilters;
};

export function MarketplaceOrdersSection({ queryFilters }: MarketplaceOrdersSectionProps) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusPendingId, setStatusPendingId] = useState<string | null>(null);
  const [customerPendingId, setCustomerPendingId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [filter, pageSize, queryFilters.search, queryFilters.from, queryFilters.to]);

  const offset = (page - 1) * pageSize;
  const listParams = ordersListParams(queryFilters);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["marketplace-orders", filter, page, pageSize, listParams],
    queryFn: () =>
      marketplaceApi.orders.list({
        limit: pageSize,
        offset,
        status: filter === "all" ? undefined : filter,
        ...listParams,
      }),
  });

  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (!selectedOrder) return;
    const fresh = orders.find((o) => o.id === selectedOrder.id);
    if (fresh) setSelectedOrder(fresh);
  }, [orders, selectedOrder?.id]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => {
      setStatusPendingId(id);
      return marketplaceApi.orders.updateStatus(id, { status });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-orders"] });
      queryClient.invalidateQueries({ queryKey: ["unified-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      setSelectedOrder((current) =>
        current?.id === updated.id ? updated : current,
      );
      toast.success("Order status updated");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
    onSettled: () => setStatusPendingId(null),
  });

  const customerMutation = useMutation({
    mutationFn: (id: string) => {
      setCustomerPendingId(id);
      return marketplaceApi.orders.createCustomer(id);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-orders"] });
      queryClient.invalidateQueries({ queryKey: ["unified-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setSelectedOrder((current) =>
        current?.id === updated.id ? updated : current,
      );
      toast.success("Customer added from order");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
    onSettled: () => setCustomerPendingId(null),
  });

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {(["all", "received", "confirmed", "dispatched", "delivered", "cancelled"] as const).map(
          (s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
              className="capitalize"
            >
              {s === "all" ? "All" : ORDER_STATUS_CONFIG[s].label}
            </Button>
          ),
        )}
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={<ShoppingBag className="h-8 w-8" />}
                title="No product orders"
                description="Storefront product orders will appear here"
              />
            </div>
          ) : (
            <>
              <div className={isFetching ? "opacity-60 pointer-events-none" : undefined}>
                <MarketplaceOrdersTable
                  orders={orders}
                  onView={(order) => {
                    setSelectedOrder(order);
                    setDetailOpen(true);
                  }}
                  onStatusChange={(id, status) =>
                    statusMutation.mutate({ id, status })
                  }
                  onCreateCustomer={(id) => customerMutation.mutate(id)}
                  statusPendingId={statusPendingId}
                  customerPendingId={customerPendingId}
                />
              </div>
              <ListPagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                itemLabel="order"
              />
            </>
          )}
        </CardContent>
      </Card>

      <MarketplaceOrderDetailPanel
        order={selectedOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
        onCreateCustomer={(id) => customerMutation.mutate(id)}
        statusPending={statusMutation.isPending}
        customerPending={customerMutation.isPending}
      />
    </>
  );
}

export function useMarketplacePendingCount(enabled: boolean) {
  const { data } = useQuery({
    queryKey: ["marketplace-orders", "pending-count"],
    queryFn: () =>
      marketplaceApi.orders.list({ limit: 1, offset: 0, status: "received" }),
    enabled,
  });
  return data?.total ?? 0;
}
