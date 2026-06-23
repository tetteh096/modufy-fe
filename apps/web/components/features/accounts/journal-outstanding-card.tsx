"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type JournalOutstandingCardProps = {
  amount: number;
  currency: string;
  loading?: boolean;
};

export function JournalOutstandingCard({ amount, currency, loading }: JournalOutstandingCardProps) {
  return (
    <Card className="shadow-sm border-amber-500/20 bg-amber-500/[0.04] dark:bg-amber-500/[0.06]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <CardTitle className="text-base">Outstanding receivable</CardTitle>
        </div>
        <CardDescription>Unpaid sent invoices in Accounts Receivable</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="h-8 w-32 animate-pulse rounded bg-muted/50" />
        ) : (
          <p className="text-2xl font-bold tabular-nums tracking-tight">
            {formatMoney(amount, currency)}
          </p>
        )}
        <p className="text-xs text-muted-foreground leading-relaxed">
          When you send an invoice, the ledger posts Dr Accounts Receivable · Cr Revenue. Customer
          payments reduce AR and increase Cash.
        </p>
        <Button variant="outline" size="sm" className="w-full justify-between h-9" render={<Link href="/invoices" />}>
          View invoices
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardContent>
    </Card>
  );
}
