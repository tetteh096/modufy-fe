"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { CalendarDays, ChevronRight, Eye, Package } from "lucide-react";
import { appointmentsApi, marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { formatDateTime, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { AppointmentStatusBadge } from "@/components/features/appointments/appointment-status";
import { ORDER_STATUS_CONFIG } from "@/components/features/marketplace/marketplace-order-status";
import { MarketplaceOrderDetailPanel } from "@/components/features/marketplace/marketplace-order-detail-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Appointment, MarketplaceOrder, OrderStatus } from "@/types/api";
import type { OrdersQueryFilters } from "@/lib/orders-filters";
import { ordersListParams } from "@/lib/orders-filters";

const MERGE_FETCH_LIMIT = 100;
const DEFAULT_PAGE_SIZE = 20;

type UnifiedRow =
  | { kind: "product"; sortAt: string; order: MarketplaceOrder }
  | { kind: "booking"; sortAt: string; booking: Appointment };

function buildRows(
  products: MarketplaceOrder[],
  bookings: Appointment[],
): UnifiedRow[] {
  const rows: UnifiedRow[] = [
    ...products.map((order) => ({
      kind: "product" as const,
      sortAt: order.created_at,
      order,
    })),
    ...bookings.map((booking) => ({
      kind: "booking" as const,
      sortAt: booking.start_time,
      booking,
    })),
  ];
  return rows.sort(
    (a, b) => new Date(b.sortAt).getTime() - new Date(a.sortAt).getTime(),
  );
}

export function UnifiedOrdersAllSection({
  marketplaceEnabled,
  appointmentsEnabled,
  queryFilters,
}: {
  marketplaceEnabled: boolean;
  appointmentsEnabled: boolean;
  queryFilters: OrdersQueryFilters;
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const listParams = ordersListParams(queryFilters);

  useEffect(() => {
    setPage(1);
  }, [pageSize, listParams.search, listParams.from, listParams.to]);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["unified-orders", "products", listParams],
    queryFn: () =>
      marketplaceApi.orders.list({ limit: MERGE_FETCH_LIMIT, offset: 0, ...listParams }),
    enabled: marketplaceEnabled,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["unified-orders", "bookings", listParams],
    queryFn: () =>
      appointmentsApi.list({ limit: MERGE_FETCH_LIMIT, offset: 0, ...listParams }),
    enabled: appointmentsEnabled,
  });

  const rows = useMemo(
    () =>
      buildRows(
        marketplaceEnabled ? (productsData?.orders ?? []) : [],
        appointmentsEnabled ? (bookingsData?.appointments ?? []) : [],
      ),
    [productsData, bookingsData, marketplaceEnabled, appointmentsEnabled],
  );

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);
  const isLoading =
    (marketplaceEnabled && productsLoading) ||
    (appointmentsEnabled && bookingsLoading);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      marketplaceApi.orders.updateStatus(id, { status }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["unified-orders"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      setSelectedOrder((current) =>
        current?.id === updated.id ? updated : current,
      );
      toast.success("Order status updated");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const customerMutation = useMutation({
    mutationFn: (id: string) => marketplaceApi.orders.createCustomer(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["unified-orders"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setSelectedOrder((current) =>
        current?.id === updated.id ? updated : current,
      );
      toast.success("Customer added from order");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (!marketplaceEnabled && !appointmentsEnabled) {
    return (
      <EmptyState
        title="No order modules enabled"
        description="Turn on Marketplace or Appointments in Settings → Modules to see orders here."
      />
    );
  }

  return (
    <>
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12">
              <EmptyState
                title="No orders yet"
                description="Product orders and service bookings will show up here"
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">When</TableHead>
                    <TableHead className="w-[72px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((row) => {
                    if (row.kind === "product") {
                      const order = row.order;
                      const cfg =
                        ORDER_STATUS_CONFIG[order.status] ??
                        ORDER_STATUS_CONFIG.received;
                      return (
                        <TableRow
                          key={`product-${order.id}`}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDetailOpen(true);
                          }}
                        >
                          <TableCell>
                            <Badge variant="outline" className="gap-1 text-[10px] font-normal">
                              <Package className="h-3 w-3" />
                              Product
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-sm">{order.guest_name}</p>
                            <p className="text-xs text-muted-foreground">{order.guest_phone}</p>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[220px] truncate">
                            {order.lines
                              .slice(0, 2)
                              .map((l) => `${l.qty}× ${l.product_name}`)
                              .join(", ")}
                          </TableCell>
                          <TableCell className="font-semibold text-sm tabular-nums">
                            {formatMoney(order.total, order.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs font-medium border-0", cfg.className)}>
                              {cfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground whitespace-nowrap">
                            {formatDateTime(order.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    const booking = row.booking;
                    const name =
                      booking.customer_name || booking.guest_name || booking.guest_phone;
                    return (
                      <TableRow key={`booking-${booking.id}`}>
                        <TableCell>
                          <Badge variant="outline" className="gap-1 text-[10px] font-normal">
                            <CalendarDays className="h-3 w-3" />
                            Booking
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-sm">{name}</p>
                          {booking.guest_phone ? (
                            <p className="text-xs text-muted-foreground">{booking.guest_phone}</p>
                          ) : null}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-[220px]">
                          {booking.service_name}
                        </TableCell>
                        <TableCell className="font-semibold text-sm tabular-nums">
                          {formatMoney(booking.service_price, booking.currency)}
                        </TableCell>
                        <TableCell>
                          <AppointmentStatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground whitespace-nowrap">
                          {formatDateTime(booking.start_time)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            nativeButton={false}
                            render={<Link href={`/appointments/${booking.id}`} />}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <ListPagination
                page={safePage}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
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
