"use client";

import { CalendarCheck, Globe, Sparkles, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/format";
import type { ServiceStatsResponse } from "@/types/api";

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  loading?: boolean;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-20 mt-1" />
          ) : (
            <p className="text-xl font-bold tracking-tight mt-0.5 truncate">{value}</p>
          )}
          {hint && !loading ? <p className="text-xs text-muted-foreground mt-1">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ServicesStatsOverview({
  stats,
  loading,
  currency = "GHS",
}: {
  stats?: ServiceStatsResponse;
  loading?: boolean;
  currency?: string;
}) {
  const catalog = stats?.catalog;
  const bookings = stats?.bookings;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="In catalogue"
        value={String(catalog?.total ?? 0)}
        hint={`${catalog?.active ?? 0} active · ${catalog?.categories ?? 0} categories`}
        icon={Wrench}
        loading={loading}
      />
      <StatCard
        title="On storefront"
        value={String(catalog?.public ?? 0)}
        hint={`${catalog?.bookable ?? 0} bookable online`}
        icon={Globe}
        loading={loading}
      />
      <StatCard
        title={`Bookings · ${stats?.period_label ?? "…"}`}
        value={String(bookings?.total ?? 0)}
        hint={
          (bookings?.upcoming ?? 0) > 0
            ? `${bookings?.upcoming ?? 0} upcoming · ${bookings?.completed ?? 0} completed · ${bookings?.cancelled ?? 0} cancelled`
            : `${bookings?.completed ?? 0} completed · ${bookings?.cancelled ?? 0} cancelled`
        }
        icon={CalendarCheck}
        loading={loading}
      />
      <StatCard
        title="Service revenue"
        value={formatMoney(bookings?.revenue ?? 0, currency)}
        hint={
          catalog?.avg_price
            ? `Avg list price ${formatMoney(catalog.avg_price, currency)}`
            : "From completed appointments"
        }
        icon={Sparkles}
        loading={loading}
      />
    </div>
  );
}
