"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { RecordSaleForm } from "@/components/features/sales/record-sale-form";

export default function EditSalePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="w-full max-w-5xl space-y-8">
      <PageHeader
        title="Edit sale"
        description="Update amount, payment method, items, or date."
        action={
          <Button
            nativeButton={false}
            render={<Link href={`/sales/${id}`} />}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />
      <RecordSaleForm saleId={id} />
    </div>
  );
}
