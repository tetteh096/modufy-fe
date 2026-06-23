"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { AlertRow } from "@/components/features/alerts/alerts-list";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AttentionListData } from "@/types/api";

type DashboardAttentionPanelProps = {
  data?: AttentionListData;
  currency?: string;
  loading?: boolean;
  className?: string;
};

export function DashboardAttentionPanel({
  data,
  currency = "GHS",
  loading,
  className,
}: DashboardAttentionPanelProps) {
  const items = data?.items ?? [];
  const count = data?.count ?? 0;
  const summary = data?.summary;

  if (loading) {
    return (
      <Card className={cn("shadow-sm", className)}>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("shadow-sm overflow-hidden", className)}>
      <CardHeader className="pb-3 border-b border-dashed">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {count > 0 ? (
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              )}
              Needs attention
            </CardTitle>
            <CardDescription>
              {count === 0
                ? "Nothing urgent right now. Invoices, stock, and payments look good."
                : `${count} item${count !== 1 ? "s" : ""} need your review`}
            </CardDescription>
          </div>
          <Link
            href="/alerts"
            className="text-xs font-medium text-primary hover:underline shrink-0 flex items-center gap-0.5"
          >
            Open alerts
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {count > 0 && summary && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {summary.critical > 0 && (
              <span className="text-[10px] font-medium rounded-full px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/20">
                {summary.critical} urgent
              </span>
            )}
            {summary.warning > 0 && (
              <span className="text-[10px] font-medium rounded-full px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {summary.warning} action
              </span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {count === 0 ? (
          <div className="flex items-center gap-3 px-5 py-6 text-sm text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <span>All caught up. Check the Alerts page for invoice due dates, stock, and tax.</span>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.slice(0, 5).map((item) => (
              <AlertRow key={item.id} item={item} currency={currency} />
            ))}
          </ul>
        )}
        {count > 5 && (
          <div className="px-5 py-3 border-t border-dashed bg-muted/10 text-center">
            <Link href="/alerts" className="text-xs font-medium text-primary hover:underline">
              View all {count} alerts →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
