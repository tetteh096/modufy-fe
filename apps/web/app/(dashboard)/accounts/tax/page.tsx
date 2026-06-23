"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Receipt } from "lucide-react";
import { accountsApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { TaxPeriodSelect } from "@/components/features/accounts/tax-period-select";
import { TaxKpiStrip } from "@/components/features/accounts/tax-kpi-strip";
import { TaxFiledBanner } from "@/components/features/accounts/tax-filed-banner";
import { TaxBreakdownPanel } from "@/components/features/accounts/tax-breakdown-panel";
import { TaxVat3Return, TaxInvoiceTable } from "@/components/features/accounts/tax-vat3-return";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GRA_NOTES = [
  "Output VAT, NHIL, and GETFund are calculated on taxable invoice sales.",
  "Mark as filed once you submit your VAT 3 return on the GRA portal.",
  "Direct cash sales without VAT are not included in this return.",
] as const;

export default function TaxPage() {
  const [period, setPeriod] = useState(() => new Date().toISOString().slice(0, 7));
  const queryClient = useQueryClient();

  const { data: vatSummary, isLoading: loadingSummary } = useQuery({
    queryKey: ["accounts", "vat-summary", period],
    queryFn: () => accountsApi.tax.vatSummary(period),
  });

  const { data: vatReturn, isLoading: loadingReturn } = useQuery({
    queryKey: ["accounts", "vat-return", period],
    queryFn: () => accountsApi.tax.vatReturn(period),
  });

  const markFiledMutation = useMutation({
    mutationFn: () => accountsApi.tax.markFiled(period, "VAT"),
    onSuccess: () => {
      toast.success(`VAT return marked as filed for ${period}`);
      queryClient.invalidateQueries({ queryKey: ["accounts", "vat-summary"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const loading = loadingSummary || loadingReturn;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax & VAT"
        description="GRA output tax, NHIL, and GETFund summary"
        action={<TaxPeriodSelect value={period} onChange={setPeriod} />}
      />

      {loadingSummary && !vatSummary ? (
        <>
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-5">
            <Skeleton className="lg:col-span-2 h-72 rounded-xl" />
            <Skeleton className="lg:col-span-3 h-72 rounded-xl" />
          </div>
        </>
      ) : vatSummary ? (
        <>
          <TaxFiledBanner
            period={period}
            filedAt={vatSummary.filed_at ?? undefined}
            onMarkFiled={() => markFiledMutation.mutate()}
            marking={markFiledMutation.isPending}
          />

          <TaxKpiStrip summary={vatSummary} loading={loadingSummary} />

          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="border-b border-dashed pb-4">
                <CardTitle className="text-base">Tax breakdown</CardTitle>
                <CardDescription>Output tax collected this month</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <TaxBreakdownPanel
                  vat={vatSummary.vat_collected}
                  nhil={vatSummary.nhil_collected}
                  getfund={vatSummary.getfund_collected}
                  currency={vatSummary.currency}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 shadow-sm">
              <CardHeader className="border-b border-dashed pb-4">
                <CardTitle className="text-base">GRA VAT 3 return</CardTitle>
                <CardDescription>Pre-filled figures for your monthly filing</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                {loadingReturn || !vatReturn ? (
                  <Skeleton className="h-48 w-full rounded-xl" />
                ) : (
                  <TaxVat3Return vatReturn={vatReturn} />
                )}
              </CardContent>
            </Card>
          </div>

          {vatReturn && vatReturn.lines.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="border-b border-dashed pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Invoice detail
                </CardTitle>
                <CardDescription>Taxable invoices included in this return</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <TaxInvoiceTable vatReturn={vatReturn} />
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm border-dashed">
            <CardContent className="py-4">
              <ul className="grid gap-2 sm:grid-cols-3 text-xs text-muted-foreground">
                {GRA_NOTES.map((note) => (
                  <li key={note} className="flex gap-2 leading-relaxed">
                    <span className="text-primary shrink-0">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Could not load tax summary. Try another period.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
