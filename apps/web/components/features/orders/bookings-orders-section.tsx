"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { appointmentsApi } from "@/lib/api";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { AppointmentsListTable } from "@/components/features/appointments/appointments-list-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrdersQueryFilters } from "@/lib/orders-filters";
import { ordersListParams } from "@/lib/orders-filters";

const DEFAULT_PAGE_SIZE = 20;

type BookingsOrdersSectionProps = {
  queryFilters: OrdersQueryFilters;
};

export function BookingsOrdersSection({ queryFilters }: BookingsOrdersSectionProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [pageSize, queryFilters.search, queryFilters.from, queryFilters.to]);

  const offset = (page - 1) * pageSize;
  const listParams = ordersListParams(queryFilters);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["appointments", "orders-list", page, pageSize, listParams],
    queryFn: () => appointmentsApi.list({ limit: pageSize, offset, ...listParams }),
  });

  const appointments = data?.appointments ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={<CalendarDays className="h-8 w-8" />}
              title="No bookings yet"
              description="Service appointments from your website will appear here"
            />
          </div>
        ) : (
          <>
            <div className={isFetching ? "opacity-60 pointer-events-none" : undefined}>
              <AppointmentsListTable appointments={appointments} />
            </div>
            <ListPagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              itemLabel="booking"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function useBookingsPendingCount(enabled: boolean) {
  const { data } = useQuery({
    queryKey: ["appointments", "pending-count"],
    queryFn: () => appointmentsApi.list({ limit: 1, offset: 0, status: "pending" }),
    enabled,
  });
  return data?.total ?? 0;
}
