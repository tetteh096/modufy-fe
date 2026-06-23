"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowLeft, FileText, Send, CreditCard, Download, Pencil, FileCheck } from "lucide-react";
import { RecordPaymentForm } from "@/components/features/invoices/record-payment-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { invoicesApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/types/api";

function invField<T>(inv: Invoice & Record<string, unknown>, camel: string, snake: string): T {
  const v = inv[camel];
  if (v !== undefined && v !== null) return v as T;
  return inv[snake] as T;
}

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending_vsdc: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  viewed: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  partial: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  paid: "bg-primary/10 text-primary",
  overdue: "bg-destructive/10 text-destructive",
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [payOpen, setPayOpen] = useState(false);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoicesApi.get(id),
    enabled: !!id,
  });

  const convertMutation = useMutation({
    mutationFn: () => invoicesApi.convertToInvoice(id),
    onSuccess: (created) => {
      toast.success("Invoice created from quote");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      router.push(`/invoices/${created.id}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const sendMutation = useMutation({
    mutationFn: () => invoicesApi.send(id),
    onSuccess: (res) => {
      const link = res.whatsapp_link;
      toast.success("Invoice sent", {
        description: res.message,
        action: link
          ? { label: "WhatsApp", onClick: () => window.open(link) }
          : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (isLoading || !invoice) {
    return <SectionLoader />;
  }

  const inv = invoice as Invoice & Record<string, unknown>;
  const number = invField<string>(inv, "number", "number");
  const customerName = invField<string>(inv, "customerName", "customer_name") ?? "Customer";
  const currency = invField<string>(inv, "currency", "currency");
  const total = invField<number>(inv, "total", "total");
  const amountDue = invField<number>(inv, "amountDue", "amount_due");
  const amountPaid = invField<number>(inv, "amountPaid", "amount_paid");
  const status = invField<Invoice["status"]>(inv, "status", "status");
  const docType = invField<string>(inv, "type", "type") ?? "invoice";
  const dueDate = invField<string | undefined>(inv, "dueDate", "due_date");
  const lines = invoice.lines ?? [];

  async function handleDownloadPdf() {
    try {
      const blob = await invoicesApi.downloadPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <PageHeader
        title={number}
        description={customerName}
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => void handleDownloadPdf()}
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            {status === "draft" && (
              <Button
                render={<Link href={`/invoices/${id}/edit`} />}
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
            {(docType === "quote" || docType === "proforma") && status === "draft" && (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => convertMutation.mutate()}
                disabled={convertMutation.isPending}
              >
                <FileCheck className="h-4 w-4" />
                Convert to invoice
              </Button>
            )}
            {(status === "draft" || status === "pending_vsdc") && docType === "invoice" && (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => sendMutation.mutate()}
                disabled={sendMutation.isPending}
              >
                <Send className="h-4 w-4" />
                {status === "pending_vsdc" ? "Retry send" : "Send"}
              </Button>
            )}
            <Button
              render={<Link href="/invoices" />}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn("border-0", statusStyles[status] ?? "")}>{status}</Badge>
        {dueDate && (
          <span className="text-xs text-muted-foreground">Due {formatDate(dueDate)}</span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold tabular-nums">{formatMoney(total, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-xl font-bold tabular-nums text-primary">
              {formatMoney(amountPaid, currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Due</p>
            <p className="text-xl font-bold tabular-nums text-secondary">
              {formatMoney(amountDue, currency)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Line items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lines.map((line, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm border-b pb-2 last:border-0">
              <div>
                <p className="font-medium">{line.description}</p>
                <p className="text-xs text-muted-foreground">
                  {line.quantity} × {formatMoney(line.unit_price ?? 0, currency)}
                </p>
              </div>
              <p className="font-semibold tabular-nums shrink-0">
                {formatMoney(line.total, currency)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {status === "pending_vsdc" && (
        <p className="text-sm text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-4 py-3">
          Waiting for GRA e-VAT approval. Configure VSDC in Settings → Tax, then send again.
        </p>
      )}

      {amountDue > 0 && status !== "paid" && status !== "cancelled" && (
        <Dialog open={payOpen} onOpenChange={setPayOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5">
                <CreditCard className="h-4 w-4" />
                Record payment
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record payment</DialogTitle>
              <DialogDescription>
                Payment on {number} — posts to customer balance automatically.
              </DialogDescription>
            </DialogHeader>
            <RecordPaymentForm
              invoice={invoice}
              onSuccess={() => {
                setPayOpen(false);
                queryClient.invalidateQueries({ queryKey: ["invoice", id] });
                queryClient.invalidateQueries({ queryKey: ["invoices"] });
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
