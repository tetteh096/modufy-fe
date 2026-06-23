"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, CalendarDays, Store, ArrowRight } from "lucide-react";
import { marketplaceApi, businessApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StorefrontActivityCard() {
  const { data: modules } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
    staleTime: 60_000,
  });

  const marketplaceEnabled = modules?.modules?.some(
    (m) => m.module === "marketplace" && m.enabled
  );

  const { data: summary, isLoading } = useQuery({
    queryKey: ["marketplace-summary"],
    queryFn: marketplaceApi.summary,
    enabled: !!marketplaceEnabled,
    refetchInterval: 60_000,
  });

  if (!marketplaceEnabled) return null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const pendingOrders = summary?.pending_orders ?? 0;
  const todayOrders = summary?.today_orders ?? 0;
  const todayBookings = summary?.today_bookings ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Store className="h-4 w-4 text-primary" />
          Storefront activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link
          href="/orders"
          className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {pendingOrders > 0 ? (
                  <span className="text-amber-600 dark:text-amber-400">
                    {pendingOrders} pending order{pendingOrders !== 1 ? "s" : ""}
                  </span>
                ) : (
                  <span className="text-muted-foreground">No pending orders</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{todayOrders} received today</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link
          href="/appointments"
          className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {todayBookings > 0 ? (
                  <span>
                    {todayBookings} storefront booking{todayBookings !== 1 ? "s" : ""} today
                  </span>
                ) : (
                  <span className="text-muted-foreground">No storefront bookings today</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">Via your public page</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </CardContent>
    </Card>
  );
}
