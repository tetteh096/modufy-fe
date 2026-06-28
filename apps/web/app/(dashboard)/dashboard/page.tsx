"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileText,
  ShoppingCart,
  TrendingDown,
  Wallet,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
  salesApi,
  expensesApi,
  customersApi,
  invoicesApi,
  businessApi,
} from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { useAuthStore } from "@/store/auth";
import { formatMoney } from "@/lib/format";
import {
  periodRange,
  DASHBOARD_PERIOD_OPTIONS,
  type DashboardPeriodFilter,
} from "@/lib/period-range";
import { PeriodFilterTabs } from "@/components/shared/period-filter-tabs";
import { BranchReportFilter, branchApiParams } from "@/components/features/branches/branch-report-filter";
import { DashboardHero } from "@/components/features/dashboard/dashboard-hero";
import { DashboardSpotlightRow } from "@/components/features/dashboard/dashboard-spotlight-row";
import { DashboardAttentionPanel } from "@/components/features/dashboard/dashboard-attention-panel";
import { AiBriefingBanner } from "@/components/features/ai/ai-briefing-banner";
import { DashboardStatCard } from "@/components/features/dashboard/dashboard-stat-card";
import { DashboardOverviewChart } from "@/components/features/dashboard/dashboard-overview-chart";
import { DashboardPaymentRadial } from "@/components/features/dashboard/dashboard-payment-radial";
import { DashboardTopProductsTable } from "@/components/features/dashboard/dashboard-top-products-table";
import { DashboardRecentSales } from "@/components/features/dashboard/dashboard-recent-sales";
import { DashboardActivityFeed } from "@/components/features/dashboard/dashboard-activity-feed";
import { StorefrontActivityCard } from "@/components/features/dashboard/storefront-activity-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Invoice } from "@/types/api";

const OUTSTANDING_STATUSES: Invoice["status"][] = ["sent", "partial", "overdue"];

export default function DashboardPage() {
  const { currency } = useDefaultCurrency();
  const user = useAuthStore((s) => s.user);
  const [periodFilter, setPeriodFilter] = useState<DashboardPeriodFilter>("today");
  const [branchFilter, setBranchFilter] = useState("all");
  const period = periodRange(periodFilter);
  const branchParams = branchApiParams(branchFilter);

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["sales-summary", "dashboard", periodFilter, period.from, period.to, branchFilter],
    queryFn: () => salesApi.summary({ ...period.summaryParams, ...branchParams }),
  });

  const { data: salesTrends, isLoading: salesTrendsLoading } = useQuery({
    queryKey: [
      "sales-trends",
      "dashboard",
      periodFilter,
      period.chartFrom,
      period.chartTo,
      branchFilter,
    ],
    queryFn: () =>
      salesApi.trends({
        from: period.chartFrom,
        to: period.chartTo,
        ...branchParams,
      }),
  });

  const { data: expenseTrends, isLoading: expenseTrendsLoading } = useQuery({
    queryKey: [
      "expenses-trends",
      "dashboard",
      periodFilter,
      period.chartFrom,
      period.chartTo,
      branchFilter,
    ],
    queryFn: () =>
      expensesApi.trends({
        from: period.chartFrom,
        to: period.chartTo,
        ...branchParams,
      }),
  });

  const { data: periodSales, isLoading: salesLoading } = useQuery({
    queryKey: ["sales", "dashboard", periodFilter, period.from, period.to, branchFilter],
    queryFn: () =>
      salesApi.list({
        from: period.from,
        to: period.to,
        limit: 20,
        page: 1,
        ...branchParams,
      }),
  });

  const { data: periodExpenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses", "dashboard", periodFilter, period.from, period.to, branchFilter],
    queryFn: () =>
      expensesApi.list({
        from: period.from,
        to: period.to,
        limit: 20,
        page: 1,
        ...branchParams,
      }),
  });

  const { data: invoiceData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices", "dashboard"],
    queryFn: () => invoicesApi.list({ limit: 50 }),
  });

  const { data: customerData, isLoading: customersLoading } = useQuery({
    queryKey: ["customers", "dashboard-count"],
    queryFn: () => customersApi.list({ limit: 1 }),
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["notifications", "dashboard"],
    queryFn: () => businessApi.notifications.list(10),
  });

  const { data: attention, isLoading: attentionLoading } = useQuery({
    queryKey: ["attention"],
    queryFn: () => businessApi.attention.list(),
    refetchInterval: 120_000,
  });

  const outstandingInvoices = useMemo(() => {
    const list = invoiceData?.invoices ?? [];
    return list.filter(
      (inv) =>
        OUTSTANDING_STATUSES.includes(inv.status) &&
        (inv.amount_due ?? 0) > 0
    );
  }, [invoiceData]);

  const totalOutstanding = useMemo(
    () =>
      outstandingInvoices.reduce(
        (s, inv) => s + (inv.amount_due ?? 0),
        0
      ),
    [outstandingInvoices]
  );

  const customerTotal = customerData?.total ?? 0;
  const chartsLoading = salesTrendsLoading || expenseTrendsLoading;
  const activityLoading =
    salesLoading || expensesLoading || invoicesLoading || notificationsLoading;

  const revenue = summary?.total_revenue ?? 0;
  const expenses = summary?.total_expenses ?? 0;
  const net = summary?.net_position ?? 0;
  const saleCount = summary?.transaction_count ?? 0;

  return (
    <div className="w-full space-y-6 pb-4">
      <DashboardHero userName={user?.name} businessName={business?.name} />

      <DashboardSpotlightRow
        customerCount={customerTotal}
        saleCount={saleCount}
        periodLabel={period.label}
        outstandingAmount={
          totalOutstanding > 0 ? formatMoney(totalOutstanding, currency) : undefined
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PeriodFilterTabs
          value={periodFilter}
          onChange={(v) => setPeriodFilter(v as DashboardPeriodFilter)}
          options={DASHBOARD_PERIOD_OPTIONS}
        />
        <BranchReportFilter value={branchFilter} onChange={setBranchFilter} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <AiBriefingBanner />
          <DashboardAttentionPanel
            data={attention}
            currency={currency}
            loading={attentionLoading}
          />
        </div>
        <StorefrontActivityCard />
      </div>

      {/* Boron-style stat row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label={`Revenue · ${period.label}`}
          value={summaryLoading ? "—" : formatMoney(revenue, currency)}
          hint={`${saleCount} sale${saleCount !== 1 ? "s" : ""} recorded`}
          href="/sales"
          icon={Wallet}
          trend={revenue > 0 ? "up" : "neutral"}
          loading={summaryLoading}
        />
        <DashboardStatCard
          label={`Expenses · ${period.label}`}
          value={summaryLoading ? "—" : formatMoney(expenses, currency)}
          hint="Cash out this period"
          href="/expenses"
          icon={TrendingDown}
          accent="destructive"
          trend={expenses > 0 ? "down" : "neutral"}
          loading={summaryLoading}
        />
        <DashboardStatCard
          label={`Net · ${period.label}`}
          value={summaryLoading ? "—" : formatMoney(net, currency)}
          hint={net >= 0 ? "Healthy position" : "Review spending"}
          href="/accounts/cashflow"
          icon={BarChart3}
          trend={net >= 0 ? "up" : "down"}
          accent={net >= 0 ? "primary" : "destructive"}
          loading={summaryLoading}
        />
        <DashboardStatCard
          label="Customers"
          value={customersLoading ? "—" : String(customerTotal)}
          hint={
            totalOutstanding > 0
              ? `${formatMoney(totalOutstanding, currency)} to collect`
              : "Your customer base"
          }
          href="/customers"
          icon={Users}
          accent="secondary"
          loading={customersLoading}
        />
      </div>

      {(summary?.by_branch?.length ?? 0) > 0 && branchFilter === "all" ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by branch · {period.label}</CardTitle>
            <CardDescription>Consolidated breakdown across locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {summary?.by_branch?.map((row) => (
                <div
                  key={row.branch_id}
                  className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{row.branch_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.count} sale{row.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums">
                    {formatMoney(row.revenue, currency)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Overview chart + payment breakdown (Boron 8+4 layout) */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Overview · {period.chartSubtitle}
            </CardTitle>
            <CardDescription>
              Daily cash in and out · running net on the right axis
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            {chartsLoading ? (
              <Skeleton className="h-[360px] w-full rounded-xl" />
            ) : (
              <DashboardOverviewChart
                revenue={salesTrends?.data ?? []}
                spending={expenseTrends?.data ?? []}
                chartFrom={period.chartFrom}
                chartTo={period.chartTo}
                currency={currency}
                chartSubtitle={period.chartSubtitle}
              />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Sales by payment
            </CardTitle>
            <CardDescription>How customers paid · {period.label}</CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            {summaryLoading ? (
              <Skeleton className="h-[320px] w-full rounded-xl" />
            ) : (
              <DashboardPaymentRadial
                byPaymentMethod={summary?.by_payment_method ?? {}}
                currency={currency}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables + sidebar (Boron lower section) */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Top selling · {period.label}
            </CardTitle>
            <CardDescription>Best line items in this period</CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            {summaryLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <DashboardTopProductsTable
                items={summary?.top_items ?? []}
                currency={currency}
              />
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent sales</CardTitle>
              <CardDescription>{period.label}</CardDescription>
            </CardHeader>
            <CardContent className="pb-5">
              <DashboardRecentSales
                sales={periodSales?.sales ?? []}
                currency={currency}
                loading={salesLoading}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Recent activity
                  </CardTitle>
                  <CardDescription>Sales, expenses & alerts</CardDescription>
                </div>
                {totalOutstanding > 0 && (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    <FileText className="h-3 w-3" />
                    {outstandingInvoices.length} due
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-5 max-h-[420px] overflow-y-auto">
              <DashboardActivityFeed
                sales={periodSales?.sales ?? []}
                expenses={periodExpenses?.expenses ?? []}
                invoices={invoiceData?.invoices ?? []}
                notifications={notifications?.notifications ?? []}
                currency={currency}
                loading={activityLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
