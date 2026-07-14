"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles, Save } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BusinessDetail } from "@/types/admin";

export function BusinessAILimitsPanel({ business }: { business: BusinessDetail }) {
  const qc = useQueryClient();
  const [limit, setLimit] = useState("5.0");
  const [softPct, setSoftPct] = useState("0.8");

  useEffect(() => {
    if (business) {
      setLimit((business.ai_cost_limit ?? 5.0).toString());
      setSoftPct((business.ai_soft_pct ?? 0.8).toString());
    }
  }, [business]);

  const updateLimits = useMutation({
    mutationFn: () =>
      adminApi.updateBusiness(business.id, {
        ai_cost_limit: Number(limit),
        ai_soft_pct: Number(softPct),
      }),
    onSuccess: () => {
      toast.success("AI budget limits updated");
      qc.invalidateQueries({ queryKey: ["admin-business", business.id] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const isChanged =
    limit !== (business.ai_cost_limit ?? 5.0).toString() ||
    softPct !== (business.ai_soft_pct ?? 0.8).toString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-brand-leaf-green animate-pulse" />
          AI budget settings
        </CardTitle>
        <CardDescription>
          Set the monthly hard cap limit and the economy model threshold for managed AI tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ai-cost-limit">Monthly limit (USD)</Label>
            <Input
              id="ai-cost-limit"
              type="number"
              step="0.5"
              min={0}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">Hard cap limit per billing cycle</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ai-soft-pct">Economy threshold (0–1)</Label>
            <Input
              id="ai-soft-pct"
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={softPct}
              onChange={(e) => setSoftPct(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">Downgrade to economy model at this ratio</p>
          </div>
        </div>

        <Button
          className="w-full gap-1.5"
          disabled={updateLimits.isPending || !isChanged}
          onClick={() => updateLimits.mutate()}
        >
          <Save className="h-4 w-4" />
          {updateLimits.isPending ? "Saving AI settings…" : "Save AI settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
