"use client";

import { Users, Building2, AlertCircle, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type CustomersSummaryCardsProps = {
  total: number;
  companyCount: number;
  owingCount: number;
  totalOwed: number;
  reachableCount: number;
  currency: string;
  loading?: boolean;
};

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
              {hint && (
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {hint}
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function CustomersSummaryCards({
  total,
  companyCount,
  owingCount,
  totalOwed,
  reachableCount,
  currency,
  loading,
}: CustomersSummaryCardsProps) {
  const individualCount = Math.max(0, total - companyCount);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total customers"
        value={loading ? "—" : String(total)}
        hint="Everyone in your book"
        icon={Users}
        loading={loading}
        accent="primary"
      />
      <StatCard
        title="Companies"
        value={loading ? "—" : String(companyCount)}
        hint={
          loading
            ? undefined
            : `${individualCount} individual${individualCount !== 1 ? "s" : ""}`
        }
        icon={Building2}
        loading={loading}
      />
      <StatCard
        title="Owing balance"
        value={loading ? "—" : String(owingCount)}
        hint={
          owingCount > 0
            ? `${formatMoney(totalOwed, currency)} to collect`
            : "All accounts clear"
        }
        icon={AlertCircle}
        loading={loading}
        accent={owingCount > 0 ? "destructive" : "muted"}
      />
      <StatCard
        title="Reachable"
        value={loading ? "—" : String(reachableCount)}
        hint="Have phone or email on file"
        icon={Phone}
        loading={loading}
      />
    </div>
  );
}
