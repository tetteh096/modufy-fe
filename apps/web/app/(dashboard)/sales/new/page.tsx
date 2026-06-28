"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { RecordSaleForm } from "@/components/features/sales/record-sale-form";

export default function RecordSalePage() {
  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="Record sale"
        description="Log money you received — cash, MoMo, or bank. Takes under a minute."
        action={
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
        }
      />
      <RecordSaleForm />
    </div>
  );
}
