"use client";

import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CreateInvoiceForm } from "@/components/features/invoices/create-invoice-form";
import type { InvoiceDocType } from "@/types/api";

export default function NewInvoicePage() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as InvoiceDocType) || "invoice";

  const titles: Record<InvoiceDocType, { title: string; description: string }> = {
    invoice: {
      title: "New invoice",
      description: "Bill a customer — send via WhatsApp when ready.",
    },
    quote: {
      title: "New quote",
      description: "Send a price estimate — convert to invoice when approved.",
    },
    proforma: {
      title: "New proforma",
      description: "Proforma invoice for customer approval.",
    },
  };

  const meta = titles[type] ?? titles.invoice;

  return (
    <div className="w-full space-y-6">
      <PageHeader title={meta.title} description={meta.description} />
      <CreateInvoiceForm docType={type} />
    </div>
  );
}
