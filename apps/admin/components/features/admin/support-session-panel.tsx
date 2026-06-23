"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, LifeBuoy, Play } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SupportSessionPanel({
  businessId,
  ticketId,
}: {
  businessId: string;
  ticketId?: string;
}) {
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const [grantId, setGrantId] = useState<string | null>(null);

  const { data: grants } = useQuery({
    queryKey: ["admin-support-grants", businessId],
    queryFn: () => adminApi.supportGrants("active"),
  });

  const businessGrants = (grants ?? []).filter((g) => g.business_id === businessId);

  const request = useMutation({
    mutationFn: () =>
      adminApi.requestSupportGrant({
        business_id: businessId,
        ticket_id: ticketId,
        scope: "read_only",
        reason: "Support troubleshooting",
      }),
    onSuccess: (g) => {
      toast.success("Access request sent — merchant must approve in Settings → Support");
      setGrantId(g.id);
      qc.invalidateQueries({ queryKey: ["admin-support-grants"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const start = useMutation({
    mutationFn: () => {
      const active = businessGrants[0];
      const gid = grantId ?? active?.id;
      return adminApi.startSupportSession({
        grant_id: gid,
        code: code || undefined,
        business_id: gid ? undefined : businessId,
      });
    },
    onSuccess: (res) => {
      toast.success("Session started — opening merchant app");
      window.open(res.enter_url, "_blank", "noopener,noreferrer");
      setCode("");
      qc.invalidateQueries({ queryKey: ["admin-audit"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <LifeBuoy className="h-4 w-4" />
          Support access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Merchant must grant access first (or approve your request). Never ask for their password.
        </p>

        {businessGrants.length > 0 ? (
          <div className="space-y-2">
            {businessGrants.map((g) => (
              <div key={g.id} className="flex items-center justify-between text-sm border rounded-md px-3 py-2">
                <div>
                  <Badge variant="secondary">{g.status}</Badge>
                  <span className="text-xs text-muted-foreground ml-2">{g.scope}</span>
                </div>
                <Button size="sm" variant="ghost" className="h-7" onClick={() => setGrantId(g.id)}>
                  Use
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Button size="sm" variant="outline" disabled={request.isPending} onClick={() => request.mutate()}>
            Request merchant approval
          </Button>
        )}

        <Input
          placeholder="6-digit code (if merchant shared one)"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="font-mono"
        />

        <Button className="w-full" disabled={start.isPending} onClick={() => start.mutate()}>
          <Play className="h-4 w-4 mr-2" />
          Start support session
          <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
        </Button>

        <p className="text-[10px] text-muted-foreground">
          Dev: without an active grant, starts a direct read-only session (not available in production).
        </p>
      </CardContent>
    </Card>
  );
}
