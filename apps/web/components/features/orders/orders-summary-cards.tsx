"use client";

import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  loading,
  accent,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  loading?: boolean;
  accent?: "primary" | "destructive" | "muted";
}) {
  const iconClass =
    accent === "destructive"
      ? "bg-destructive/10 text-destructive"
      : accent === "primary"
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";

  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-5 md:p-6">
        <div className={cn("rounded-lg p-2.5 shrink-0", iconClass)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-20 mt-1" />
          ) : (
            <>
              <p className="text-lg font-bold tracking-tight truncate">{value}</p>
              {hint ? (
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{hint}</p>
              ) : null}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type OrdersSummaryCardsProps = {
  periodLabel: string;
  pendingTotal: number;
  todayTotal: number;
  periodTotal: number;
  periodProductCount: number;
  periodBookingCount: number;
  periodRevenue: number;
  currency: string;
  marketplaceEnabled: boolean;
  appointmentsEnabled: boolean;
  loading?: boolean;
};

export function OrdersSummaryCards({
  periodLabel,
  pendingTotal,
  todayTotal,
  periodTotal,
  periodProductCount,
  periodBookingCount,
  periodRevenue,
  currency,
  marketplaceEnabled,
  appointmentsEnabled,
  loading,
}: OrdersSummaryCardsProps) {
  const periodHint =
    marketplaceEnabled && appointmentsEnabled
      ? `${periodProductCount} product · ${periodBookingCount} booking`
      : marketplaceEnabled
        ? `${periodProductCount} product order${periodProductCount !== 1 ? "s" : ""}`
        : `${periodBookingCount} booking${periodBookingCount !== 1 ? "s" : ""}`;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Need attention"
        value={String(pendingTotal)}
        hint={pendingTotal > 0 ? "Pending confirmation" : "All caught up"}
        icon={AlertCircle}
        loading={loading}
        accent={pendingTotal > 0 ? "destructive" : "muted"}
      />
      <StatCard
        title="Today"
        value={String(todayTotal)}
        hint="Orders and bookings today"
        icon={CalendarDays}
        loading={loading}
        accent="primary"
      />
      <StatCard
        title={periodLabel}
        value={String(periodTotal)}
        hint={periodHint}
        icon={ClipboardList}
        loading={loading}
      />
      <StatCard
        title={`Revenue · ${periodLabel.toLowerCase()}`}
        value={formatMoney(periodRevenue, currency)}
        hint="Product totals + service prices"
        icon={TrendingUp}
        loading={loading}
        accent="primary"
      />
    </div>
  );
}
