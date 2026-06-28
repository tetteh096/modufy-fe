"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plug, MessageSquare, Mail, ArrowLeft } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function IntegrationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-integrations"],
    queryFn: () => adminApi.integrations(),
  });

  const [arkeselKey, setArkeselKey] = useState("");
  const [arkeselSender, setArkeselSender] = useState("");
  const [sandbox, setSandbox] = useState(true);
  const [provider, setProvider] = useState<"arkesel" | "hubtel">("arkesel");
  const [testPhone, setTestPhone] = useState("");
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    if (!data) return;
    setArkeselSender(data.arkesel_sender_id || "BizOS");
    setSandbox(data.sms_sandbox);
    setProvider(data.sms_provider === "hubtel" ? "hubtel" : "arkesel");
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      adminApi.updateIntegrations({
        sms_provider: provider,
        arkesel_api_key: arkeselKey.trim() || undefined,
        arkesel_sender_id: arkeselSender.trim() || undefined,
        sms_sandbox: sandbox,
      }),
    onSuccess: () => {
      toast.success("Integrations saved");
      setArkeselKey("");
      qc.invalidateQueries({ queryKey: ["admin-integrations"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const testMutation = useMutation({
    mutationFn: () => adminApi.testSMS({ phone: testPhone }),
    onSuccess: (res) => toast.success(res.message),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const testEmailMutation = useMutation({
    mutationFn: () => adminApi.testEmail({ email: testEmail }),
    onSuccess: (res) => toast.success(res.message),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/settings" className="inline-flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Settings
        </Link>
      </div>

      <PageHeader
        title="Integrations"
        description="Platform SMS and email providers. Tenants send through these credentials — not their own API keys."
      />

      {isLoading ? (
        <SectionLoader className="py-12" />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Plug className="h-4 w-4" />
                SMS provider
              </CardTitle>
              <CardDescription>
                Arkesel is recommended for Ghana. Keys are encrypted at rest. Leave API key blank to keep the current one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={provider === "arkesel" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setProvider("arkesel")}>
                  Arkesel
                </Badge>
                <Badge variant={provider === "hubtel" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setProvider("hubtel")}>
                  Hubtel (legacy)
                </Badge>
              </div>

              {data?.arkesel_configured ? (
                <p className="text-xs text-muted-foreground">
                  Arkesel key configured {data.arkesel_api_key_hint ? `(${data.arkesel_api_key_hint})` : ""}
                </p>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-500">No Arkesel API key saved yet.</p>
              )}

              {data?.sms_balance ? (
                <p className="text-sm">
                  Balance: <span className="font-medium">{data.sms_balance}</span>
                </p>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="arkesel-key">Arkesel API key</Label>
                <Input
                  id="arkesel-key"
                  type="password"
                  placeholder={data?.arkesel_api_key_hint ? "Leave blank to keep current key" : "Paste API key from Arkesel dashboard"}
                  value={arkeselKey}
                  onChange={(e) => setArkeselKey(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender-id">Sender ID (max 11 chars)</Label>
                <Input
                  id="sender-id"
                  maxLength={11}
                  placeholder="BizOS"
                  value={arkeselSender}
                  onChange={(e) => setArkeselSender(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={sandbox}
                  onChange={(e) => setSandbox(e.target.checked)}
                />
                Sandbox mode (no real delivery, no credits charged)
              </label>

              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving…" : "Save SMS settings"}
              </Button>

              {data?.sms_inbound_url ? (
                <div className="space-y-1 border-t pt-3">
                  <Label className="text-xs">Incoming message (STOP) callback URL</Label>
                  <p className="text-xs font-mono break-all rounded-md border bg-muted/40 px-2 py-1.5">
                    {data.sms_inbound_url}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    In the Arkesel dashboard, set this as the incoming-message callback. Customers who reply STOP are opted out of marketing SMS automatically.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email (Resend)
              </CardTitle>
              <CardDescription>
                Configured via API env vars (RESEND_API_KEY, RESEND_FROM). Register the webhook URL in Resend for delivery status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.resend_configured ? (
                <p className="text-xs text-muted-foreground">
                  Sending as <span className="font-medium text-foreground">{data.resend_from}</span>
                </p>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-500">
                  Email not configured — set RESEND_API_KEY and RESEND_FROM on the API service.
                </p>
              )}
              {data?.resend_webhook_url ? (
                <div className="space-y-1">
                  <Label className="text-xs">Delivery webhook URL</Label>
                  <p className="text-xs font-mono break-all rounded-md border bg-muted/40 px-2 py-1.5">
                    {data.resend_webhook_url}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    In Resend → Webhooks, subscribe to delivered, bounced, and complained. Set RESEND_WEBHOOK_SECRET on the API to verify signatures.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Test email
              </CardTitle>
              <CardDescription>Send a test message after Resend is configured.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Input
                className="max-w-xs"
                type="email"
                placeholder="you@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <Button
                variant="outline"
                disabled={testEmailMutation.isPending || !testEmail.trim()}
                onClick={() => testEmailMutation.mutate()}
              >
                {testEmailMutation.isPending ? "Sending…" : "Send test"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Test SMS
              </CardTitle>
              <CardDescription>Send a test message to your phone after saving the API key.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Input
                className="max-w-xs"
                placeholder="e.g. 0544919953"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
              />
              <Button
                variant="outline"
                disabled={testMutation.isPending || !testPhone.trim()}
                onClick={() => testMutation.mutate()}
              >
                {testMutation.isPending ? "Sending…" : "Send test"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
