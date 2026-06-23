"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarClock,
  ExternalLink,
  FileText,
  Pencil,
  Trash2,
  User,
  Calendar,
  Receipt,
  Wallet,
} from "lucide-react";
import { salesApi, getApiErrorMessage } from "@/lib/api";
import { paymentMethodMeta } from "@/lib/sales-constants";
import { formatMoney, formatPaymentMethod, formatDate, formatDateTime } from "@/lib/format";
import { saleSourceBadgeClass, saleSourceLabel } from "@/lib/sale-source";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: sale, isLoading } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => salesApi.get(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => salesApi.delete(id),
    onSuccess: () => {
      toast.success("Sale deleted");
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      router.push("/sales");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (isLoading || !sale) {
    return <SectionLoader />;
  }

  const payMeta = paymentMethodMeta(sale.payment_method);
  const PayIcon = payMeta?.icon ?? Wallet;
  const firstLine = sale.lines[0]?.description ?? "Sale";
  const hasPartial =
    (sale.amount_paid ?? 0) > 0 && (sale.amount_due ?? 0) > 0 && sale.status === "pending";

  return (
    <div className="w-full max-w-5xl space-y-8">
      <PageHeader
        title={firstLine}
        description={`Sale · ${formatDate(sale.sale_date)}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/sales" />}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Sales
            </Button>
            <Button
              nativeButton={false}
              render={<Link href={`/sales/${id}/edit`} />}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PayIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold tabular-nums tracking-tight">
                    {formatMoney(sale.total, sale.currency)}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {formatPaymentMethod(sale.payment_method)}
                    </Badge>
                    {sale.source_type ? (
                      <Badge variant="outline" className={saleSourceBadgeClass(sale.source_type)}>
                        {saleSourceLabel(sale.source_type)}
                      </Badge>
                    ) : null}
                    {sale.receipt_number ? (
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {sale.receipt_number}
                      </Badge>
                    ) : null}
                    {sale.status === "pending" ? (
                      <Badge variant="secondary">Pending booking</Badge>
                    ) : null}
                    {hasPartial ? (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                        Partial payment
                      </Badge>
                    ) : null}
                  </div>
                  {hasPartial ? (
                    <div className="mt-3 space-y-1 text-sm">
                      <p className="text-emerald-600 dark:text-emerald-400 tabular-nums">
                        Collected: {formatMoney(sale.amount_paid ?? 0, sale.currency)}
                      </p>
                      <p className="text-muted-foreground tabular-nums">
                        Balance due: {formatMoney(sale.amount_due ?? 0, sale.currency)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(sale.sale_date)}
                </span>
                {sale.customer_name && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {sale.customer_name}
                  </span>
                )}
              </div>
              {sale.note && (
                <p className="text-sm border-t pt-4 text-muted-foreground">{sale.note}</p>
              )}
              {(sale.source_type === "pos" || sale.linked_appointment_id || sale.linked_invoice_id) && (
                <div className="flex flex-wrap gap-2 border-t pt-4">
                  {sale.source_type === "pos" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        nativeButton={false}
                        render={<Link href="/pos/sales" />}
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        POS receipts
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        nativeButton={false}
                        render={<Link href="/accounts/journal" />}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Accounts journal
                      </Button>
                    </>
                  ) : null}
                  {sale.linked_appointment_id ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      nativeButton={false}
                      render={<Link href={`/appointments/${sale.linked_appointment_id}`} />}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      View booking
                    </Button>
                  ) : null}
                  {sale.linked_invoice_id ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      nativeButton={false}
                      render={<Link href={`/invoices/${sale.linked_invoice_id}`} />}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View invoice
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            Line items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {sale.lines.map((line) => (
              <li
                key={line.id ?? line.description}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{line.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {line.quantity} × {formatMoney(line.unit_price, sale.currency)}
                  </p>
                </div>
                <p className="font-semibold text-sm tabular-nums shrink-0">
                  {formatMoney(line.total, sale.currency)}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this sale?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {formatMoney(sale.total, sale.currency)} from your sales history.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
              onClick={() => {
                setDeleteOpen(false);
                deleteMutation.mutate();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
