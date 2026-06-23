"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LifeBuoy, ShieldCheck, Copy } from "lucide-react";
import { supportApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SupportSettingsPage() {
  const qc = useQueryClient();
  const [reason, setReason] = useState("");
  const [lastCode, setLastCode] = useState<string | null>(null);

  const { data: grants, isLoading } = useQuery({
    queryKey: ["support-grants"],
    queryFn: () => supportApi.grants(),
  });

  const create = useMutation({
    mutationFn: () =>
      supportApi.createGrant({ scope: "read_only", reason, hours: 2 }),
    onSuccess: (res) => {
      toast.success("Support access granted for 2 hours");
      setLastCode(res.code ?? null);
      setReason("");
      qc.invalidateQueries({ queryKey: ["support-grants"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => supportApi.revokeGrant(id),
    onSuccess: () => {
      toast.success("Access revoked");
      qc.invalidateQueries({ queryKey: ["support-grants"] });
      qc.invalidateQueries({ queryKey: ["support-sessions-active"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const regen = useMutation({
    mutationFn: (id: string) => supportApi.regenerateCode(id),
    onSuccess: (res) => {
      setLastCode(res.code);
      toast.success("New code generated");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const approve = useMutation({
    mutationFn: (id: string) => supportApi.approveGrant(id),
    onSuccess: () => {
      toast.success("Support request approved");
      qc.invalidateQueries({ queryKey: ["support-grants"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div>
      <PageHeader
        title="Support access"
        description="Let BizOS help you without sharing your password. You control when access starts and ends."
      />

      <SettingsSection
        title="Grant access"
        description="Creates a 2-hour window. Share the 6-digit code with support only if they ask for it."
      >
        <div className="space-y-3 max-w-md">
          <Input
            placeholder="What do you need help with? (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button disabled={create.isPending} onClick={() => create.mutate()}>
            <ShieldCheck className="h-4 w-4 mr-2" />
            Grant support access (2 hours)
          </Button>
          {lastCode && (
            <Card className="bg-muted/50">
              <CardContent className="py-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">One-time code for support</p>
                  <p className="font-mono text-lg font-bold tracking-widest">{lastCode}</p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(lastCode);
                    toast.success("Copied");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="Requests & grants" description="Pending requests from BizOS and active grants.">
        {isLoading ? (
          <SectionLoader className="py-8" />
        ) : !grants?.length ? (
          <p className="text-sm text-muted-foreground">No support grants yet.</p>
        ) : (
          <div className="space-y-3">
            {grants.map((g) => (
              <div
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">{g.status}</Badge>
                    <span className="text-xs text-muted-foreground">{g.scope}</span>
                  </div>
                  {g.reason && <p className="text-sm mt-1">{g.reason}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Expires {new Date(g.expires_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {g.status === "pending" && (
                    <Button size="sm" disabled={approve.isPending} onClick={() => approve.mutate(g.id)}>
                      Approve
                    </Button>
                  )}
                  {g.status === "active" && (
                    <>
                      <Button size="sm" variant="outline" disabled={regen.isPending} onClick={() => regen.mutate(g.id)}>
                        New code
                      </Button>
                      <Button size="sm" variant="destructive" disabled={revoke.isPending} onClick={() => revoke.mutate(g.id)}>
                        Revoke
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SettingsSection>
    </div>
  );
}
