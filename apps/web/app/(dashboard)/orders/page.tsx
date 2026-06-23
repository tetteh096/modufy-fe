"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ShoppingBag } from "lucide-react";
import { appointmentsApi, marketplaceApi } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { useDebounce } from "@/hooks/use-debounce";
import { useBusinessModules } from "@/hooks/use-business-modules";
import { periodRange, type PeriodFilter } from "@/lib/period-range";
import { ordersListParams, type OrdersQueryFilters } from "@/lib/orders-filters";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersSummaryCards } from "@/components/features/orders/orders-summary-cards";
import { OrdersToolbar } from "@/components/features/orders/orders-toolbar";
import {
  BookingsOrdersSection,
  useBookingsPendingCount,
} from "@/components/features/orders/bookings-orders-section";
import {
  MarketplaceOrdersSection,
  useMarketplacePendingCount,
} from "@/components/features/orders/marketplace-orders-section";
import { UnifiedOrdersAllSection } from "@/components/features/orders/unified-orders-all-section";

type OrdersTab = "all" | "products" | "bookings";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useDefaultCurrency();
  const { isMarketplaceEnabled, isAppointmentsEnabled, isLoading } = useBusinessModules();

  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const showTabs = isMarketplaceEnabled && isAppointmentsEnabled;
  const period = periodRange(periodFilter);

  const queryFilters: OrdersQueryFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      from: period.from,
      to: period.to,
    }),
    [debouncedSearch, period.from, period.to],
  );

  const listParams = ordersListParams(queryFilters);

  const tab = useMemo((): OrdersTab => {
    if (!showTabs) {
      if (isMarketplaceEnabled) return "products";
      if (isAppointmentsEnabled) return "bookings";
      return "all";
    }
    const raw = searchParams.get("tab");
    if (raw === "products") return "products";
    if (raw === "bookings") return "bookings";
    return "all";
  }, [showTabs, searchParams, isMarketplaceEnabled, isAppointmentsEnabled]);

  const productPending = useMarketplacePendingCount(isMarketplaceEnabled);
  const bookingPending = useBookingsPendingCount(isAppointmentsEnabled);
  const pendingTotal = productPending + bookingPending;

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["marketplace-summary"],
    queryFn: marketplaceApi.summary,
    enabled: isMarketplaceEnabled || isAppointmentsEnabled,
  });

  const { data: productStats, isLoading: productStatsLoading } = useQuery({
    queryKey: ["orders-stats", "products", listParams],
    queryFn: () => marketplaceApi.orders.list({ ...listParams, limit: 500, offset: 0 }),
    enabled: isMarketplaceEnabled,
  });

  const { data: bookingStats, isLoading: bookingStatsLoading } = useQuery({
    queryKey: ["orders-stats", "bookings", listParams],
    queryFn: () => appointmentsApi.list({ ...listParams, limit: 500, offset: 0 }),
    enabled: isAppointmentsEnabled,
  });

  const periodProductCount = productStats?.total ?? 0;
  const periodBookingCount = bookingStats?.total ?? 0;
  const periodTotal = periodProductCount + periodBookingCount;
  const periodRevenue =
    (productStats?.orders ?? []).reduce((sum, order) => sum + order.total, 0) +
    (bookingStats?.appointments ?? []).reduce((sum, appt) => sum + appt.service_price, 0);
  const todayTotal = (summary?.today_orders ?? 0) + (summary?.today_bookings ?? 0);
  const statsLoading =
    summaryLoading ||
    (isMarketplaceEnabled && productStatsLoading) ||
    (isAppointmentsEnabled && bookingStatsLoading);

  useEffect(() => {
    if (!showTabs) return;
    const raw = searchParams.get("tab");
    if (raw === "products" && !isMarketplaceEnabled) router.replace("/orders");
    if (raw === "bookings" && !isAppointmentsEnabled) router.replace("/orders");
  }, [searchParams, isMarketplaceEnabled, isAppointmentsEnabled, router, showTabs]);

  function setTab(next: OrdersTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") params.delete("tab");
    else params.set("tab", next);
    const qs = params.toString();
    router.replace(qs ? `/orders?${qs}` : "/orders");
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Orders"
        description="Product orders and service bookings in one place"
      />

      {(isMarketplaceEnabled || isAppointmentsEnabled) && (
        <>
          <OrdersSummaryCards
            periodLabel={period.label}
            pendingTotal={pendingTotal}
            todayTotal={todayTotal}
            periodTotal={periodTotal}
            periodProductCount={periodProductCount}
            periodBookingCount={periodBookingCount}
            periodRevenue={periodRevenue}
            currency={currency}
            marketplaceEnabled={isMarketplaceEnabled}
            appointmentsEnabled={isAppointmentsEnabled}
            loading={statsLoading}
          />

          <OrdersToolbar
            search={search}
            onSearchChange={setSearch}
            period={periodFilter}
            onPeriodChange={setPeriodFilter}
          />
        </>
      )}

      {showTabs ? (
        <Tabs value={tab} onValueChange={(v) => setTab(v as OrdersTab)}>
          <TabsList>
            <TabsTrigger value="all">All orders</TabsTrigger>
            <TabsTrigger value="products" className="gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              Products
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Bookings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ) : null}

      {!isLoading && !isMarketplaceEnabled && !isAppointmentsEnabled ? (
        <EmptyState
          title="No order modules enabled"
          description="Enable Marketplace or Appointments in Settings → Modules."
        />
      ) : null}

      {tab === "all" && showTabs ? (
        <UnifiedOrdersAllSection
          marketplaceEnabled={isMarketplaceEnabled}
          appointmentsEnabled={isAppointmentsEnabled}
          queryFilters={queryFilters}
        />
      ) : null}

      {tab === "products" && isMarketplaceEnabled ? (
        <MarketplaceOrdersSection queryFilters={queryFilters} />
      ) : null}

      {tab === "bookings" && isAppointmentsEnabled ? (
        <BookingsOrdersSection queryFilters={queryFilters} />
      ) : null}
    </div>
  );
}
