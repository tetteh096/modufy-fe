"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  LogOut,
  Maximize2,
  Receipt,
  Settings,
} from "lucide-react";
import { posApi } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { Spinner } from "@/components/shared/spinner";
import { PosTopBar } from "@/components/features/pos/pos-top-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PosHomeScreen() {
  const { data: session, isLoading } = useQuery({
    queryKey: ["pos-session"],
    queryFn: posApi.getActiveSession,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PosTopBar />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PosTopBar />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Register</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Sell in-store, print receipts, park sales, and close your shift — all from one counter.
          </p>
        </div>

        {session ? (
          <Card className="border-primary/25 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Shift open · {session.register_name}</CardTitle>
              <CardDescription>
                {session.sales_count ?? 0} sales today
                {(session.sales_total ?? 0) > 0
                  ? ` · ${formatMoney(session.sales_total ?? 0, "GHS")}`
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button nativeButton={false} render={<Link href="/pos/register" />} size="lg" className="gap-2">
                <Maximize2 className="h-4 w-4" />
                Open register
              </Button>
              <Button
                nativeButton={false}
                render={<Link href={`/pos/session/close?session=${session.id}`} />}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Close shift
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">No register open</CardTitle>
              <CardDescription>Open a shift to start selling at the counter.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button nativeButton={false} render={<Link href="/pos/register" />} size="lg" className="gap-2">
                <Banknote className="h-4 w-4" />
                Open register
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Sales & receipts
              </CardTitle>
              <CardDescription>Reprint receipts, void same-day sales, review today&apos;s tickets.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button nativeButton={false} render={<Link href="/pos/sales" />} variant="outline" className="w-full">
                View POS sales
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                POS settings
              </CardTitle>
              <CardDescription>Receipt footer, default payment, discounts, out-of-stock display.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button nativeButton={false} render={<Link href="/settings/pos" />} variant="outline" className="w-full">
                Configure POS
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
