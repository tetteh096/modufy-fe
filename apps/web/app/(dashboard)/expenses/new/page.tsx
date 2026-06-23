"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { LogExpenseForm } from "@/components/features/expenses/log-expense-form";

export default function LogExpensePage() {
  return (
    <div className="w-full max-w-3xl space-y-8">
      <PageHeader
        title="Log expense"
        description="Record money going out — rent, stock, transport, wages, and more."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/expenses" />}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Expenses
          </Button>
        }
      />
      <LogExpenseForm />
    </div>
  );
}
