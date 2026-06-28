"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "@/components/features/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="Add customer"
        description="Track purchases, invoices, and what they owe you."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/customers" />}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Customers
          </Button>
        }
      />
      <CustomerForm />
    </div>
  );
}
