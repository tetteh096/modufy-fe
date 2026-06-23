"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { accountsApi, salesApi, expensesApi } from "@/lib/api";
import { mergeTrendDays } from "@/lib/dashboard-chart-data";
import {
  accountsPeriodRange,
  type AccountsPeriodFilter,
} from "@/lib/accounts-period-range";
import {
  monthlyTrendToChartPoints,
  type AccountsChartPoint,
} from "@/lib/accounts-chart-utils";
import { AccountsPeriodSelect } from "@/components/features/accounts/accounts-period-select";
import {
  AccountsComposedChart,
  AccountsKpiStrip,
} from "@/components/features/accounts/accounts-composed-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type AccountsOverviewPanelProps = {
  period: AccountsPeriodFilter;
  onPeriodChange: (period: AccountsPeriodFilter) => void;
};

export function AccountsOverviewPanel({ period, onPeriodChange }: AccountsOverviewPanelProps) {
  const range = useMemo(() => accountsPeriodRange(period), [period]);

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["accounts", "summary", period, range.summaryFrom, range.summaryTo],
    queryFn: () =>
      accountsApi.summary({ from: range.summaryFrom, to: range.summaryTo }),
  });

  const { data: trendData, isLoading: loadingMonthly } = useQuery({
    queryKey: ["accounts", "trend", period, range.trendMonths],
    queryFn: () => accountsApi.trend(range.trendMonths),
    enabled: range.chartMode === "monthly",
  });

  const { data: salesTrends, isLoading: loadingSales } = useQuery({
    queryKey: ["sales-trends", "accounts", period, range.chartFrom, range.chartTo],
    queryFn: () =>
      salesApi.trends({ from: range.chartFrom, to: range.chartTo }),
    enabled: range.chartMode === "daily",
  });

  const { data: expenseTrends, isLoading: loadingExpenses } = useQuery({
    queryKey: ["expenses-trends", "accounts", period, range.chartFrom, range.chartTo],
    queryFn: () =>
      expensesApi.trends({ from: range.chartFrom, to: range.chartTo }),
    enabled: range.chartMode === "daily",
  });

  const currency =
    summary?.currency ?? trendData?.currency ?? salesTrends?.currency ?? "GHS";

  const chartData: AccountsChartPoint[] = useMemo(() => {
    if (range.chartMode === "monthly") {
      return monthlyTrendToChartPoints(trendData?.months ?? []);
    }
    return mergeTrendDays(
      salesTrends?.data ?? [],
      expenseTrends?.data ?? [],
      range.chartFrom,
      range.chartTo
    );
  }, [
    range.chartMode,
    range.chartFrom,
    range.chartTo,
    trendData?.months,
    salesTrends?.data,
    expenseTrends?.data,
  ]);

  const loadingChart =
    range.chartMode === "monthly"
      ? loadingMonthly
      : loadingSales || loadingExpenses;

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="border-b border-dashed pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Financial overview</CardTitle>
            <CardDescription>
              Revenue vs expenses · {range.label.toLowerCase()}
            </CardDescription>
          </div>
          <AccountsPeriodSelect value={period} onChange={onPeriodChange} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <AccountsKpiStrip
          revenue={summary?.revenue ?? 0}
          expenses={summary?.expenses ?? 0}
          net={summary?.net_profit ?? 0}
          tax={summary?.tax_liability ?? 0}
          marginPct={summary?.gross_margin_pct ?? 0}
          currency={currency}
          loading={loadingSummary}
        />

        {loadingChart ? (
          <div className="h-[340px] animate-pulse rounded-xl bg-muted/40" />
        ) : (
          <AccountsComposedChart data={chartData} currency={currency} />
        )}

        <p className="text-[11px] text-center text-muted-foreground">
          {range.chartSubtitle} · hover a bar for daily net
        </p>
      </CardContent>
    </Card>
  );
}
