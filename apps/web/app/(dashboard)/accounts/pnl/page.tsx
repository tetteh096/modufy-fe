"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";
import { pnlDateRange, type PnlDatePreset } from "@/lib/pnl-date-range";
import { PageHeader } from "@/components/shared/page-header";
import { PnlDateToolbar } from "@/components/features/accounts/pnl-date-toolbar";
import { PnlKpiStrip } from "@/components/features/accounts/pnl-kpi-strip";
import { PnlStatement, PnlRevenueMix } from "@/components/features/accounts/pnl-statement";
import { PnlExpenseChart } from "@/components/features/accounts/pnl-expense-chart";
import { AiPnLExplainSheet } from "@/components/features/ai/ai-pnl-explain-sheet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PnLPage() {
  const initial = pnlDateRange("month");
  const [preset, setPreset] = useState<PnlDatePreset | "custom">("month");
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);

  const { data: pnl, isLoading } = useQuery({
    queryKey: ["accounts", "pnl", from, to],
    queryFn: () => accountsApi.pnl({ from, to }),
  });

  const handlePreset = (next: PnlDatePreset) => {
    const range = pnlDateRange(next);
    setPreset(next);
    setFrom(range.from);
    setTo(range.to);
  };

  const handleFrom = (value: string) => {
    setPreset("custom");
    setFrom(value);
  };

  const handleTo = (value: string) => {
    setPreset("custom");
    setTo(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="P&L Report"
        description="Profit and loss statement for your business"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AiPnLExplainSheet from={from} to={to} />
            <PnlDateToolbar
            from={from}
            to={to}
            preset={preset}
            onPresetChange={handlePreset}
            onFromChange={handleFrom}
            onToChange={handleTo}
          />
          </div>
        }
      />

      {isLoading ? (
        <>
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-5">
            <Skeleton className="lg:col-span-3 h-[28rem] rounded-xl" />
            <Skeleton className="lg:col-span-2 h-[28rem] rounded-xl" />
          </div>
        </>
      ) : pnl ? (
        <>
          <PnlKpiStrip pnl={pnl} />

          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 shadow-sm">
              <CardHeader className="border-b border-dashed pb-4">
                <CardTitle className="text-base">Income statement</CardTitle>
                <CardDescription>Revenue through to net profit</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <PnlStatement pnl={pnl} />
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Revenue mix</CardTitle>
                  <CardDescription>Where your income came from</CardDescription>
                </CardHeader>
                <CardContent>
                  <PnlRevenueMix
                    items={pnl.revenue_by_source}
                    currency={pnl.currency}
                    total={pnl.revenue}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Expenses by category</CardTitle>
                  <CardDescription>Operating costs in this period</CardDescription>
                </CardHeader>
                <CardContent>
                  <PnlExpenseChart items={pnl.expenses_by_category} currency={pnl.currency} />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Could not load this report. Check your date range and try again.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
