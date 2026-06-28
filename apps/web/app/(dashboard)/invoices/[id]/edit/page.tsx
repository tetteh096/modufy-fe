"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { invoicesApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { CreateInvoiceForm } from "@/components/features/invoices/create-invoice-form";

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoicesApi.get(id),
    enabled: !!id,
  });

  if (isLoading || !invoice) {
    return <SectionLoader />;
  }

  if (invoice.status !== "draft") {
    return (
      <div className="space-y-4 max-w-lg">
        <p className="text-sm text-muted-foreground">
          Only draft documents can be edited. This invoice is <strong>{invoice.status}</strong>.
        </p>
        <Button render={<Link href={`/invoices/${id}`} />} variant="outline" size="sm">
          Back to invoice
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={`Edit ${invoice.number}`}
        description="Update line items, dates, and terms before sending"
        action={
          <Button
            render={<Link href={`/invoices/${id}`} />}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
        }
      />
      <CreateInvoiceForm invoiceId={id} docType={invoice.type as "invoice" | "quote" | "proforma"} />
    </div>
  );
}
