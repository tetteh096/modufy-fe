"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { expensesApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { LogExpenseForm } from "@/components/features/expenses/log-expense-form";

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();

  const { data: expense, isLoading } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => expensesApi.get(id),
    enabled: !!id,
  });

  if (isLoading) return <SectionLoader />;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Edit expense"
        description="Update amount, category, or date."
      />
      <LogExpenseForm expense={expense} />
    </div>
  );
}
