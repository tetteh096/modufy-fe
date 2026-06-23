"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";
import { pnlDateRange, type PnlDatePreset } from "@/lib/pnl-date-range";
import { cashFlowChartPoints } from "@/lib/cashflow-utils";
import { PageHeader } from "@/components/shared/page-header";
import { PnlDateToolbar } from "@/components/features/accounts/pnl-date-toolbar";
import {
  CashFlowKpiStrip,
  CashFlowPaymentBreakdown,
} from "@/components/features/accounts/cashflow-kpi-strip";
import { CashFlowDailyChart } from "@/components/features/accounts/cashflow-daily-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CashFlowPage() {
  const initial = pnlDateRange("month");
  const [preset, setPreset] = useState<PnlDatePreset | "custom">("month");
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);

  const { data: cf, isLoading } = useQuery({
    queryKey: ["accounts", "cashflow", from, to],
    queryFn: () => accountsApi.cashflow({ from, to }),
  });

  const chartData = useMemo(
    () => cashFlowChartPoints(cf?.daily ?? []),
    [cf?.daily]
  );

  const handlePreset = (next: PnlDatePreset) => {
    const range = pnlDateRange(next);
    setPreset(next);
    setFrom(range.from);
    setTo(range.to);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash Flow"
        description="Money in and out by day"
        action={
          <PnlDateToolbar
            from={from}
            to={to}
            preset={preset}
            onPresetChange={handlePreset}
            onFromChange={(v) => {
              setPreset("custom");
              setFrom(v);
            }}
            onToChange={(v) => {
              setPreset("custom");
              setTo(v);
            }}
          />
        }
      />

      {isLoading ? (
        <>
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-5">
            <Skeleton className="lg:col-span-3 h-96 rounded-xl" />
            <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          </div>
        </>
      ) : cf ? (
        <>
          <CashFlowKpiStrip
            totalIn={cf.total_in}
            totalOut={cf.total_out}
            closingBalance={cf.closing_balance}
            currency={cf.currency}
          />

          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 shadow-sm">
              <CardHeader className="border-b border-dashed pb-4">
                <CardTitle className="text-base">Daily cash flow</CardTitle>
                <CardDescription>Cash in and out · running balance in tooltip</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <CashFlowDailyChart data={chartData} currency={cf.currency} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="border-b border-dashed pb-4">
                <CardTitle className="text-base">Cash in by method</CardTitle>
                <CardDescription>How customers paid you</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <CashFlowPaymentBreakdown
                  byMethod={cf.by_payment_method}
                  currency={cf.currency}
                />
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Could not load cash flow. Check your date range and try again.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
