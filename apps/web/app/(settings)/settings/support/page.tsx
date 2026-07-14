"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LifeBuoy, ShieldCheck, Copy, Send, MessageSquare, Loader2 } from "lucide-react";
import { supportApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SupportSettingsPage() {
  const qc = useQueryClient();
  const [reason, setReason] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");
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

  const submitTicket = useMutation({
    mutationFn: () =>
      supportApi.createTicket({ subject: ticketSubject.trim(), body: ticketBody.trim() }),
    onSuccess: () => {
      toast.success("Help request submitted successfully. Modufy support will contact you shortly.");
      setTicketSubject("");
      setTicketBody("");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 animate-in fade-in-50 duration-200">
      <PageHeader
        title="Support access"
        description="Let Modufy help you without sharing your password. You control when access starts and ends."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Grant & Request */}
        <div className="lg:col-span-7 space-y-6">
          {/* Grant Access Card */}
          <Card className="border border-border/60 bg-card shadow-xs overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              <div>
                <h3 className="font-bold text-sm text-foreground">Grant Support Access</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Creates a secure 2-hour impersonation window for troubleshooting</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="grant-reason" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Troubleshooting Note (Optional)</Label>
                <Input
                  id="grant-reason"
                  placeholder="e.g. Debugging POS print errors"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-10 text-xs font-medium border-border/80 focus-visible:ring-primary/25"
                />
              </div>

              <Button
                disabled={create.isPending}
                onClick={() => create.mutate()}
                className="w-full gap-2 h-10 font-bold text-xs shadow-sm"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Grant Access (2 Hours)</span>
              </Button>

              {lastCode && (
                <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-4 flex items-center justify-between gap-4 animate-in zoom-in-95 duration-200 shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">One-time Support Code</span>
                    <p className="font-mono text-2xl font-black tracking-widest text-primary leading-none">{lastCode}</p>
                    <p className="text-[10px] text-muted-foreground">Valid for 2 hours. Share ONLY with official Modufy staff.</p>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 shrink-0 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors shadow-2xs"
                    onClick={() => {
                      void navigator.clipboard.writeText(lastCode);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Direct Help Request Card */}
          <Card className="border border-border/60 bg-card shadow-xs overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4 flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-primary" />
              <div>
                <h3 className="font-bold text-sm text-foreground">Request Support Help</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Send a message directly to platform administrators</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ticket-subject" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</Label>
                <Input
                  id="ticket-subject"
                  placeholder="What issue are you experiencing?"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="h-10 text-xs font-medium border-border/80 focus-visible:ring-primary/25"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ticket-body" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message Description</Label>
                <Textarea
                  id="ticket-body"
                  placeholder="Describe your request in detail. Modufy support will reply to your account email."
                  value={ticketBody}
                  onChange={(e) => setTicketBody(e.target.value)}
                  rows={4}
                  className="resize-none text-xs font-medium border-border/80 focus-visible:ring-primary/25 scrollbar-thin"
                />
              </div>

              <Button
                variant="outline"
                disabled={!ticketSubject.trim() || !ticketBody.trim() || submitTicket.isPending}
                onClick={() => submitTicket.mutate()}
                className="w-full gap-2 h-10 font-bold text-xs shadow-2xs hover:bg-muted/50 border-border/80"
              >
                {submitTicket.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Submit Help Request</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Grants & Sessions */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border border-border/60 bg-card shadow-xs overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Requests & Grants</h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-border/60">
                {grants?.length ?? 0} total
              </Badge>
            </div>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-xs font-medium">Loading grants...</span>
                </div>
              ) : !grants?.length ? (
                <div className="py-8 text-center space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">No support grants recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                  {grants.map((g) => {
                    const isActive = g.status === "active";
                    const isPending = g.status === "pending";
                    const isRevoked = g.status === "revoked";
                    const isExpired = g.status === "expired";
                    
                    return (
                      <div
                        key={g.id}
                        className={cn(
                          "rounded-xl border p-4 space-y-3 transition-all shadow-3xs",
                          isActive && "border-emerald-500/20 bg-emerald-500/[0.01]",
                          isPending && "border-amber-500/20 bg-amber-500/[0.01]",
                          (isRevoked || isExpired) && "border-border/60 bg-muted/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                className={cn(
                                  "text-[9px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider leading-none shrink-0",
                                  isActive && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
                                  isPending && "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
                                  (isRevoked || isExpired) && "bg-muted text-muted-foreground border border-border"
                                )}
                              >
                                {g.status}
                              </Badge>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                                {g.scope}
                              </span>
                            </div>
                            {g.reason && (
                              <p className="text-xs font-semibold text-foreground mt-1.5 leading-snug">
                                {g.reason}
                              </p>
                            )}
                            <p className="text-[10px] text-muted-foreground font-medium mt-1">
                              Expires {new Date(g.expires_at).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {(isActive || isPending) && (
                          <div className="flex gap-2 border-t pt-2.5 border-border/30">
                            {isPending && (
                              <Button
                                size="sm"
                                disabled={approve.isPending}
                                onClick={() => approve.mutate(g.id)}
                                className="w-full h-8 text-xs font-bold shadow-2xs"
                              >
                                Approve Request
                              </Button>
                            )}
                            {isActive && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={regen.isPending}
                                  onClick={() => regen.mutate(g.id)}
                                  className="flex-1 h-8 text-xs font-bold border-border/80 shadow-3xs"
                                >
                                  New Code
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={revoke.isPending}
                                  onClick={() => revoke.mutate(g.id)}
                                  className="flex-1 h-8 text-xs font-bold shadow-3xs"
                                >
                                  Revoke
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
