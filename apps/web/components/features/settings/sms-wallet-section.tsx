"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { businessApi } from "@/lib/api";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const WELCOME_PACK = 50;

function balanceStatus(balance: number, low: boolean) {
  if (balance <= 0) return { label: "Empty", tone: "destructive" as const };
  if (low) return { label: "Running low", tone: "warning" as const };
  return { label: "Healthy", tone: "good" as const };
}

export function SMSWalletSection() {
  const { data: wallet, isLoading } = useQuery({
    queryKey: ["sms-wallet"],
    queryFn: () => businessApi.smsWallet.get(),
  });

  if (isLoading) {
    return (
      <SettingsSection title="SMS credits" description="Loading…" icon={MessageSquare}>
        <Skeleton className="h-32 w-full rounded-xl" />
      </SettingsSection>
    );
  }

  if (!wallet) return null;

  const status = balanceStatus(wallet.balance_credits, wallet.low_balance);
  const capacity = Math.max(WELCOME_PACK, wallet.balance_credits + wallet.credits_used_30d, 1);
  const fillPct = Math.min(100, Math.round((wallet.balance_credits / capacity) * 100));

  return (
    <SettingsSection
      title="SMS credits"
      description="Send appointment reminders, Messages, and coupon SMS through Modufy. New accounts start with 50 welcome credits."
      icon={MessageSquare}
      contentClassName="space-y-5"
    >
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-card to-card p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Credits remaining
            </p>
            <p className="text-4xl font-semibold tabular-nums tracking-tight">
              {wallet.balance_credits}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge
                variant="outline"
                className={cn(
                  "text-[11px] font-medium",
                  status.tone === "good" && "border-primary/30 bg-primary/10 text-primary",
                  status.tone === "warning" && "border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
                  status.tone === "destructive" && "border-destructive/30 bg-destructive/10 text-destructive",
                )}
              >
                {status.tone === "warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {status.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Low-balance warning below {wallet.low_balance_threshold} credits
              </span>
            </div>
          </div>

          <div className="flex gap-3 text-sm shrink-0">
            <div className="rounded-lg border bg-background/80 px-3 py-2 text-center min-w-[88px]">
              <p className="text-lg font-semibold tabular-nums">{wallet.sent_30d}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sent 30d</p>
            </div>
            <div className="rounded-lg border bg-background/80 px-3 py-2 text-center min-w-[88px]">
              <p className="text-lg font-semibold tabular-nums">{wallet.credits_used_30d}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Used 30d</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Balance</span>
            <span>{fillPct}% of recent allowance</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                status.tone === "destructive" && "bg-destructive",
                status.tone === "warning" && "bg-amber-500",
                status.tone === "good" && "bg-primary",
              )}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
            <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
            1 credit per SMS segment · messages show your business name in the text
          </p>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0 h-8" render={<Link href="/communications" />}>
            Open Messages
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {wallet.low_balance && (
        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
          Need more credits? Contact Modufy support to top up — self-serve purchase is coming soon.
        </p>
      )}
    </SettingsSection>
  );
}
