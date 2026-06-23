"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileSpreadsheet,
  Landmark,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AccountsOverviewPanel } from "@/components/features/accounts/accounts-overview-panel";
import { Card, CardContent } from "@/components/ui/card";
import type { AccountsPeriodFilter } from "@/lib/accounts-period-range";

const QUICK_LINKS = [
  {
    label: "P&L Report",
    href: "/accounts/pnl",
    desc: "Revenue and expense breakdown",
    icon: TrendingUp,
  },
  {
    label: "Cash Flow",
    href: "/accounts/cashflow",
    desc: "Money in and out by day",
    icon: Landmark,
  },
  {
    label: "Tax & VAT",
    href: "/accounts/tax",
    desc: "VAT 3 return, NHIL, GETFund",
    icon: Receipt,
  },
  {
    label: "Journal",
    href: "/accounts/journal",
    desc: "Full double-entry ledger",
    icon: BookOpen,
  },
] as const;

export default function AccountsOverviewPage() {
  const [period, setPeriod] = useState<AccountsPeriodFilter>("month");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        description="Financial overview across all modules"
      />

      <AccountsOverviewPanel period={period} onPeriodChange={setPeriod} />

      <div>
        <div className="mb-3 flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Reports &amp; ledger</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
                <CardContent className="flex items-start gap-3 pt-5 pb-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {item.label}
                      </p>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
