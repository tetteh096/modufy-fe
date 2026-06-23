"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Receipt,
  BookOpen,
  ShoppingBag,
  Clock,
  Store,
} from "lucide-react";
import { posApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney, formatDateTime } from "@/lib/format";
import { paymentMethodMeta } from "@/lib/sales-constants";
import { Spinner } from "@/components/shared/spinner";
import { PosTopBar } from "@/components/features/pos/pos-top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function shiftDuration(openedAt: string, closedAt?: string | null) {
  const start = new Date(openedAt).getTime();
  const end = closedAt ? new Date(closedAt).getTime() : Date.now();
  const mins = Math.max(0, Math.round((end - start) / 60000));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function PosCloseSessionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const sessionId = params.get("session") ?? "";

  const [counted, setCounted] = useState("");
  const [note, setNote] = useState("");

  const reportQuery = useQuery({
    queryKey: ["pos-session-close-report", sessionId],
    queryFn: () => posApi.sessionCloseReport(sessionId),
    enabled: !!sessionId,
  });

  const closeMutation = useMutation({
    mutationFn: () =>
      posApi.closeSession(sessionId, {
        counted_cash: Number(counted) || 0,
        close_note: note,
      }),
    onSuccess: () => {
      toast.success("Register closed");
      queryClient.invalidateQueries({ queryKey: ["pos-session"] });
      queryClient.invalidateQueries({ queryKey: ["pos-sales-report"] });
      router.push("/pos");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const report = reportQuery.data;
  const currency = report?.currency ?? "GHS";
  const expected = report?.expected_cash_in_drawer ?? 0;
  const hasSales = (report?.sales_count ?? 0) > 0;

  if (reportQuery.isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PosTopBar />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PosTopBar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-muted-foreground">Could not load this shift.</p>
          <Button nativeButton={false} render={<Link href="/pos" />} variant="outline">
            Back to POS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PosTopBar />
      <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Close register</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {report.register_name} · opened {formatDateTime(report.opened_at)} by {report.opened_by_name}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Shift revenue</p>
              <p className="text-xl font-bold tabular-nums">{formatMoney(report.sales_total ?? 0, currency)}</p>
              <p className="text-xs text-muted-foreground mt-1">{report.sales_count ?? 0} sale{(report.sales_count ?? 0) !== 1 ? "s" : ""}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-xl font-bold">{shiftDuration(report.opened_at, report.closed_at)}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Still open
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">In Sales & Accounts</p>
              <p className="text-xl font-bold">{hasSales ? "Posted" : "Nothing yet"}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.accounts_note}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment breakdown</CardTitle>
            <CardDescription>All methods this shift — only cash goes in the physical drawer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(report.by_payment ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No completed sales this shift.</p>
            ) : (
              report.by_payment.map((row) => {
                const pay = paymentMethodMeta(row.payment_method);
                return (
                  <div key={row.payment_method} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Badge variant="outline">{pay?.label ?? row.payment_method}</Badge>
                      <span className="text-muted-foreground">{row.sale_count} sale{row.sale_count !== 1 ? "s" : ""}</span>
                    </span>
                    <span className="font-medium tabular-nums">{formatMoney(row.total, currency)}</span>
                  </div>
                );
              })
            )}
            <div className="rounded-lg bg-muted/60 p-4 space-y-2 text-sm border-t mt-2 pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Opening float (cash)</span>
                <span>{formatMoney(report.opening_float, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">+ Cash sales</span>
                <span>{formatMoney(report.cash_sales_total, currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>MoMo / card / other (not in drawer)</span>
                <span>{formatMoney(report.non_cash_sales_total, currency)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Expected cash in drawer</span>
                <span>{formatMoney(expected, currency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {(report.receipts ?? []).length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Receipts this shift
              </CardTitle>
              <CardDescription>Each one is in Sales and your Accounts journal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {report.receipts.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between gap-2 text-sm rounded-md border px-3 py-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{sale.receipt_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(sale.sale_date)}
                      {sale.cashier_name ? ` · ${sale.cashier_name}` : ""}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums shrink-0">{formatMoney(sale.total, sale.currency)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Count the drawer</CardTitle>
            <CardDescription>Enter physical cash — compare to expected {formatMoney(expected, currency)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Counted cash</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={counted}
                onChange={(e) => setCounted(e.target.value)}
                placeholder={expected > 0 ? String(expected) : "0"}
              />
              {counted !== "" && (
                <p
                  className={cn(
                    "text-sm tabular-nums",
                    Number(counted) - expected === 0
                      ? "text-primary"
                      : Number(counted) - expected > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-destructive"
                  )}
                >
                  Variance: {formatMoney(Number(counted) - expected, currency)}
                  {Number(counted) - expected === 0 ? " · balanced" : ""}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Shortage explanation, handover notes…" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button nativeButton={false} render={<Link href="/pos/register" />} variant="outline" className="flex-1">
                Back to register
              </Button>
              <Button
                className="flex-1"
                onClick={() => closeMutation.mutate()}
                disabled={closeMutation.isPending || counted === ""}
              >
                {closeMutation.isPending ? <Spinner className="h-4 w-4" /> : "Close shift"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button nativeButton={false} render={<Link href="/sales?source=pos" />} variant="outline" className="gap-2 flex-1">
            <ShoppingBag className="h-4 w-4" />
            View in Sales
          </Button>
          <Button nativeButton={false} render={<Link href="/accounts/journal" />} variant="outline" className="gap-2 flex-1">
            <BookOpen className="h-4 w-4" />
            Accounts journal
          </Button>
          <Button nativeButton={false} render={<Link href="/pos/sales" />} variant="outline" className="gap-2 flex-1">
            <Store className="h-4 w-4" />
            POS report
          </Button>
        </div>
        <Button nativeButton={false} render={<Link href="/dashboard" />} variant="ghost" className="w-full gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
