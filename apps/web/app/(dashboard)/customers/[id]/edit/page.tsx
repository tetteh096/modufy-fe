"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { customersApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { CustomerForm } from "@/components/features/customers/customer-form";

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customersApi.get(id),
    enabled: !!id,
  });

  if (isLoading || !customer) {
    return <SectionLoader />;
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader title="Edit customer" description="Update contact and billing details." />
      <CustomerForm customer={customer} />
    </div>
  );
}
