"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, Plus } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionLoader } from "@/components/shared/page-loader";

export function BusinessSMSWalletPanel({ businessId }: { businessId: string }) {
  const qc = useQueryClient();
  const [credits, setCredits] = useState("50");
  const [note, setNote] = useState("");

  const { data: wallet, isLoading } = useQuery({
    queryKey: ["admin-sms-wallet", businessId],
    queryFn: () => adminApi.businessSMSWallet(businessId),
  });

  const grant = useMutation({
    mutationFn: () =>
      adminApi.grantBusinessSMSCredits(businessId, {
        credits: Number(credits),
        note: note.trim() || undefined,
      }),
    onSuccess: (data) => {
      toast.success(`Granted credits — new balance: ${data.balance_credits}`);
      setNote("");
      qc.invalidateQueries({ queryKey: ["admin-sms-wallet", businessId] });
      qc.invalidateQueries({ queryKey: ["admin-sms-usage", businessId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const { data: usage } = useQuery({
    queryKey: ["admin-sms-usage", businessId],
    queryFn: () => adminApi.businessSMSUsage(businessId, 10),
  });

  if (isLoading || !wallet) {
    return <SectionLoader className="py-8" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          SMS wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground">Balance</p>
            <p className="text-xl font-semibold tabular-nums">{wallet.balance_credits}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground">Sent (30d)</p>
            <p className="text-xl font-semibold tabular-nums">{wallet.sent_30d}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground">Credits used (30d)</p>
            <p className="text-xl font-semibold tabular-nums">{wallet.credits_used_30d}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-[120px_1fr_auto] gap-2 items-end">
          <div>
            <Label htmlFor="sms-credits">Grant credits</Label>
            <Input
              id="sms-credits"
              type="number"
              min={1}
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sms-note">Note (optional)</Label>
            <Input
              id="sms-note"
              placeholder="Welcome pack, support top-up…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <Button
            className="gap-1.5"
            disabled={grant.isPending || !credits || Number(credits) < 1}
            onClick={() => grant.mutate()}
          >
            <Plus className="h-4 w-4" />
            Grant
          </Button>
        </div>

        {usage && usage.items.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Recent usage</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {usage.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span>
                    {item.event_type} → {item.recipient}
                    {item.sandbox ? " (sandbox)" : ""}
                  </span>
                  <span className="tabular-nums shrink-0">
                    {item.status} · {item.credits_charged}c
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
