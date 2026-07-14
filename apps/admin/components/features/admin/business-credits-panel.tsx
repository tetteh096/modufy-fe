"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Mail,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionLoader } from "@/components/shared/page-loader";

type CreditKind = "sms" | "email";

const WELCOME_PACK = 50;

function balanceTone(balance: number, threshold: number) {
  if (balance <= 0) return "destructive" as const;
  if (balance <= threshold) return "warning" as const;
  return "good" as const;
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background/60 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

function UsageRow({
  eventType,
  recipient,
  status,
  credits,
  extra,
}: {
  eventType: string;
  recipient: string;
  status: string;
  credits: number;
  extra?: string;
}) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2 text-xs">
      <div className="min-w-0">
        <p className="font-medium truncate">
          {eventType} → {recipient}
          {extra ? ` ${extra}` : ""}
        </p>
        <p className="text-muted-foreground capitalize">{status}</p>
      </div>
      <span className="shrink-0 tabular-nums font-medium">{credits}c</span>
    </li>
  );
}

function CreditWalletCard({
  kind,
  wallet,
  usage,
  credits,
  setCredits,
  note,
  setNote,
  onGrant,
  isGranting,
}: {
  kind: CreditKind;
  wallet: {
    balance_credits: number;
    low_balance_threshold: number;
    sent_30d: number;
    credits_used_30d: number;
  };
  usage: { id: string; event_type: string; recipient: string; credits_charged: number; status: string; sandbox?: boolean }[];
  credits: string;
  setCredits: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  onGrant: () => void;
  isGranting: boolean;
}) {
  const isSms = kind === "sms";
  const Icon = isSms ? MessageSquare : Mail;
  const title = isSms ? "SMS credits" : "Email credits";
  const description = isSms
    ? "Platform-routed SMS — reminders, messages, and campaign texts."
    : "Marketing email sends — newsletters and campaign blasts via Resend.";
  const tone = balanceTone(wallet.balance_credits, wallet.low_balance_threshold);
  const capacity = Math.max(WELCOME_PACK, wallet.balance_credits + wallet.credits_used_30d, 1);
  const fillPct = Math.min(100, Math.round((wallet.balance_credits / capacity) * 100));

  return (
    <Card className={cn("overflow-hidden", isSms ? "border-primary/15" : "border-blue-500/15")}>
      <div
        className={cn(
          "border-b px-5 py-4",
          isSms
            ? "bg-gradient-to-r from-primary/8 via-primary/4 to-transparent"
            : "bg-gradient-to-r from-blue-500/8 via-blue-500/4 to-transparent",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                isSms ? "bg-primary/15 text-primary" : "bg-blue-500/15 text-blue-600 dark:text-blue-400",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground max-w-md">{description}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[10px]",
              tone === "good" && "border-primary/30 bg-primary/10 text-primary",
              tone === "warning" && "border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
              tone === "destructive" && "border-destructive/30 bg-destructive/10 text-destructive",
            )}
          >
            {tone === "good" ? "Healthy" : tone === "warning" ? "Low balance" : "Empty"}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-5 p-5">
        <div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Balance</p>
              <p className="text-3xl font-semibold tabular-nums tracking-tight">
                {wallet.balance_credits.toLocaleString()}
              </p>
            </div>
            <p className="text-xs text-muted-foreground pb-1">
              Low warning below {wallet.low_balance_threshold}
            </p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isSms ? "bg-primary" : "bg-blue-500",
              )}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatCell label="Sent (30d)" value={wallet.sent_30d} />
          <StatCell label="Used (30d)" value={wallet.credits_used_30d} />
        </div>

        <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Grant credits
          </div>
          <div className="grid sm:grid-cols-[100px_1fr_auto] gap-2 items-end">
            <div>
              <Label htmlFor={`${kind}-credits`}>Amount</Label>
              <Input
                id={`${kind}-credits`}
                type="number"
                min={1}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`${kind}-note`}>Note</Label>
              <Input
                id={`${kind}-note`}
                placeholder="Welcome pack, support top-up…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button
              className="gap-1.5"
              disabled={isGranting || !credits || Number(credits) < 1}
              onClick={onGrant}
            >
              <Plus className="h-4 w-4" />
              Grant
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            New businesses receive {WELCOME_PACK} welcome credits automatically. Top up here for support or paid packs.
          </p>
        </div>

        {usage.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Send className="h-4 w-4 text-muted-foreground" />
              Recent usage
            </div>
            <ul className="space-y-1.5">
              {usage.map((item) => (
                <UsageRow
                  key={item.id}
                  eventType={item.event_type}
                  recipient={item.recipient}
                  status={item.status}
                  credits={item.credits_charged}
                  extra={item.sandbox ? "(sandbox)" : undefined}
                />
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function BusinessCreditsPanel({ businessId }: { businessId: string }) {
  const qc = useQueryClient();
  const [smsCredits, setSmsCredits] = useState("50");
  const [smsNote, setSmsNote] = useState("");
  const [emailCredits, setEmailCredits] = useState("50");
  const [emailNote, setEmailNote] = useState("");

  const { data: smsWallet, isLoading: smsLoading } = useQuery({
    queryKey: ["admin-sms-wallet", businessId],
    queryFn: () => adminApi.businessSMSWallet(businessId),
  });

  const { data: emailWallet, isLoading: emailLoading } = useQuery({
    queryKey: ["admin-email-wallet", businessId],
    queryFn: () => adminApi.businessEmailWallet(businessId),
  });

  const { data: smsUsage } = useQuery({
    queryKey: ["admin-sms-usage", businessId],
    queryFn: () => adminApi.businessSMSUsage(businessId, 8),
  });

  const { data: emailUsage } = useQuery({
    queryKey: ["admin-email-usage", businessId],
    queryFn: () => adminApi.businessEmailUsage(businessId, 8),
  });

  const grantSms = useMutation({
    mutationFn: () =>
      adminApi.grantBusinessSMSCredits(businessId, {
        credits: Number(smsCredits),
        note: smsNote.trim() || undefined,
      }),
    onSuccess: (data) => {
      toast.success(`SMS credits granted — balance: ${data.balance_credits}`);
      setSmsNote("");
      qc.invalidateQueries({ queryKey: ["admin-sms-wallet", businessId] });
      qc.invalidateQueries({ queryKey: ["admin-sms-usage", businessId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const grantEmail = useMutation({
    mutationFn: () =>
      adminApi.grantBusinessEmailCredits(businessId, {
        credits: Number(emailCredits),
        note: emailNote.trim() || undefined,
      }),
    onSuccess: (data) => {
      toast.success(`Email credits granted — balance: ${data.balance_credits}`);
      setEmailNote("");
      qc.invalidateQueries({ queryKey: ["admin-email-wallet", businessId] });
      qc.invalidateQueries({ queryKey: ["admin-email-usage", businessId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (smsLoading || emailLoading || !smsWallet || !emailWallet) {
    return <SectionLoader className="py-12" />;
  }

  const totalBalance = smsWallet.balance_credits + emailWallet.balance_credits;
  const totalUsed30d = smsWallet.credits_used_30d + emailWallet.credits_used_30d;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Combined balance</p>
              <p className="text-lg font-semibold tabular-nums">{totalBalance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">SMS balance</p>
              <p className="text-lg font-semibold tabular-nums">{smsWallet.balance_credits.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email balance</p>
              <p className="text-lg font-semibold tabular-nums">{emailWallet.balance_credits.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground -mt-2">
        {totalUsed30d.toLocaleString()} credits used across both channels in the last 30 days.
      </p>

      <div className="grid gap-6 xl:grid-cols-2">
        <CreditWalletCard
          kind="sms"
          wallet={smsWallet}
          usage={smsUsage?.items ?? []}
          credits={smsCredits}
          setCredits={setSmsCredits}
          note={smsNote}
          setNote={setSmsNote}
          onGrant={() => grantSms.mutate()}
          isGranting={grantSms.isPending}
        />
        <CreditWalletCard
          kind="email"
          wallet={emailWallet}
          usage={emailUsage?.items ?? []}
          credits={emailCredits}
          setCredits={setEmailCredits}
          note={emailNote}
          setNote={setEmailNote}
          onGrant={() => grantEmail.mutate()}
          isGranting={grantEmail.isPending}
        />
      </div>
    </div>
  );
}
