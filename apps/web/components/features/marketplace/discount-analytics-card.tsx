"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Eye, Tag, Ticket } from "lucide-react";
import { marketplaceApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/format";

export function DiscountAnalyticsCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["marketplace-discount-analytics"],
    queryFn: marketplaceApi.discounts.analytics,
  });

  if (isLoading) {
    return <Skeleton className="h-36 w-full rounded-xl" />;
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          Discount performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              Deals page views
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums">{data.deals_page_views}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Ticket className="h-3.5 w-3.5" />
              Coupon redemptions
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums">{data.coupon_redemptions_total}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag className="h-3.5 w-3.5" />
              Live deals
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums">{data.active_promotions}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Ticket className="h-3.5 w-3.5" />
              Active coupons
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums">{data.active_coupons}</p>
          </div>
        </div>

        {data.redemptions_by_coupon.length > 0 ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Top coupons
            </p>
            <ul className="space-y-1.5 text-sm">
              {data.redemptions_by_coupon.map((row) => (
                <li key={row.coupon_id} className="flex justify-between gap-3 rounded-md px-2 py-1 hover:bg-muted/50">
                  <span className="font-mono font-medium">{row.code}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {row.redemptions}× · {formatMoney(row.total_discount)} saved
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
