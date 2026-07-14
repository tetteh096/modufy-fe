"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, AlertTriangle, ArrowRight, Sparkles, Check, Loader2 } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const WELCOME_PACK = 50;

function balanceStatus(balance: number, low: boolean) {
  if (balance <= 0) return { label: "Empty", tone: "destructive" as const };
  if (low) return { label: "Running low", tone: "warning" as const };
  return { label: "Healthy", tone: "good" as const };
}

export function SMSWalletSection() {
  const queryClient = useQueryClient();
  const { data: wallet, isLoading } = useQuery({
    queryKey: ["sms-wallet"],
    queryFn: () => businessApi.smsWallet.get(),
  });

  const [thresholdVal, setThresholdVal] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Sync state with fetched data
  useEffect(() => {
    if (wallet) {
      setThresholdVal(String(wallet.low_balance_threshold));
    }
  }, [wallet]);

  const updateMutation = useMutation({
    mutationFn: (threshold: number) =>
      businessApi.smsWallet.update({ low_balance_threshold: threshold }),
    onSuccess: (data) => {
      queryClient.setQueryData(["sms-wallet"], data);
      queryClient.invalidateQueries({ queryKey: ["attention"] });
      toast.success("Low balance threshold updated");
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
      // Revert to current threshold
      if (wallet) {
        setThresholdVal(String(wallet.low_balance_threshold));
      }
    },
  });

  const handleSaveThreshold = () => {
    const val = parseInt(thresholdVal, 10);
    if (Number.isNaN(val) || val < 0) {
      toast.error("Please enter a valid non-negative number");
      if (wallet) {
        setThresholdVal(String(wallet.low_balance_threshold));
      }
      return;
    }
    if (wallet && val === wallet.low_balance_threshold) {
      setIsEditing(false);
      return;
    }
    updateMutation.mutate(val);
  };

  if (isLoading) {
    return (
      <SettingsSection title="SMS credits" description="Loading…" icon={MessageSquare}>
        <Skeleton className="h-44 w-full rounded-xl" />
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
      contentClassName="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-xl border bg-card p-6 shadow-xs">
        {/* Left Columns - Balance & Configuration */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Credits Remaining
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[11px] font-semibold px-2.5 py-0.5",
                  status.tone === "good" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                  status.tone === "warning" && "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 animate-pulse",
                  status.tone === "destructive" && "border-destructive/20 bg-destructive/10 text-destructive",
                )}
              >
                {status.tone === "warning" && <AlertTriangle className="h-3 w-3 mr-1 shrink-0" />}
                {status.label}
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight tabular-nums text-foreground">
                {wallet.balance_credits}
              </span>
              <span className="text-sm font-medium text-muted-foreground">credits</span>
            </div>
          </div>

          {/* Dynamic Warning Config */}
          <div className="rounded-lg bg-muted/40 border p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <Label htmlFor="low-balance-threshold" className="text-xs font-semibold text-foreground">
                  Low-balance alert threshold
                </Label>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Warn me when my remaining balance falls below this number.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <Input
                    id="low-balance-threshold"
                    type="number"
                    min={0}
                    max={1000}
                    disabled={updateMutation.isPending}
                    value={thresholdVal}
                    onChange={(e) => {
                      setThresholdVal(e.target.value);
                      setIsEditing(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveThreshold();
                      }
                    }}
                    onBlur={handleSaveThreshold}
                    className="h-8 w-20 pl-2 pr-6 text-center font-medium tabular-nums text-xs"
                  />
                  {updateMutation.isPending && (
                    <Loader2 className="absolute right-1.5 top-2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  )}
                  {!updateMutation.isPending && isEditing && (
                    <div className="absolute right-1.5 top-2.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-medium">credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Usage Metrics & Progress */}
        <div className="space-y-5 lg:border-l lg:pl-6 border-border/60 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Sent 30d
              </span>
              <p className="text-xl font-bold tabular-nums text-foreground">{wallet.sent_30d}</p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Used 30d
              </span>
              <p className="text-xl font-bold tabular-nums text-foreground">{wallet.credits_used_30d}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
              <span>Balance Allowance</span>
              <span className="tabular-nums">{fillPct}% available</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  status.tone === "destructive" && "bg-destructive",
                  status.tone === "warning" && "bg-amber-500",
                  status.tone === "good" && "bg-primary",
                )}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-border/50 bg-gradient-to-r from-primary/5 via-card to-card">
        <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <span>
            <strong className="text-foreground font-semibold">Self-serve SMS rates:</strong> 1 credit per SMS segment · messages show your business name in the text.
          </span>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs font-semibold" render={<Link href="/communications" />}>
            Open Messages
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {wallet.low_balance && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-3.5">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
              Low SMS Credit Balance
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Modufy is warning you because your remaining balance has fallen below your warning threshold. 
              Please contact Modufy support to top up your balance. Self-serve credit purchases are coming soon.
            </p>
          </div>
        </div>
      )}
    </SettingsSection>
  );
}
