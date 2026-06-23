"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsField } from "@/components/features/settings/settings-field";
import { cn } from "@/lib/utils";

interface VsdcSectionProps {
  configured: boolean;
}

export function VsdcSection({ configured }: VsdcSectionProps) {
  const queryClient = useQueryClient();
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const saveMutation = useMutation({
    mutationFn: businessApi.updateVsdc,
    onSuccess: async () => {
      toast.success("VSDC credentials saved");
      setClientSecret("");
      await queryClient.invalidateQueries({ queryKey: ["business"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const clearMutation = useMutation({
    mutationFn: businessApi.clearVsdc,
    onSuccess: async () => {
      toast.success("VSDC credentials removed");
      setClientId("");
      setClientSecret("");
      await queryClient.invalidateQueries({ queryKey: ["business"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const busy = saveMutation.isPending || clearMutation.isPending;

  function handleSave() {
    if (!clientId.trim()) {
      toast.error("Client ID is required");
      return;
    }
    if (!configured && !clientSecret.trim()) {
      toast.error("Client secret is required for first-time setup");
      return;
    }
    saveMutation.mutate({
      client_id: clientId.trim(),
      client_secret: clientSecret.trim() || undefined,
    });
  }

  return (
    <SettingsSection
      title="GRA E-VAT (VSDC)"
      icon={ShieldCheck}
      description="Connect once for e-invoicing through Ghana Revenue Authority"
      className={cn(configured && "border-primary/20")}
      contentClassName="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/15 px-4 py-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              configured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            {configured ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {configured ? "Connected to GRA" : "Not connected yet"}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {configured
                ? "Invoices can submit to GRA e-VAT. Update credentials below if they change."
                : "Add credentials from the GRA portal to send compliant e-invoices."}
            </p>
          </div>
        </div>
        <Badge variant={configured ? "default" : "secondary"} className="shrink-0">
          {configured ? "Connected" : "Setup required"}
        </Badge>
      </div>

      <div className="rounded-xl border border-border/70 bg-background p-4 sm:p-5">
        <div className="grid gap-6 sm:grid-cols-2">
          <SettingsField
            label="Client ID"
            htmlFor="vsdc_client_id"
            hint="From your GRA E-VAT portal dashboard"
          >
            <Input
              id="vsdc_client_id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder={configured ? "New client ID to replace existing" : "Paste client ID"}
              autoComplete="off"
              className="h-10 font-mono text-sm"
              disabled={busy}
            />
          </SettingsField>

          <SettingsField
            label="Client secret"
            htmlFor="vsdc_client_secret"
            hint={
              configured
                ? "Leave blank to keep your current secret"
                : "Paste the matching client secret"
            }
          >
            <Input
              id="vsdc_client_secret"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder={configured ? "••••••••••••" : "Paste client secret"}
              autoComplete="new-password"
              className="h-10 font-mono text-sm"
              disabled={busy}
            />
          </SettingsField>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/10 px-4 py-3">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Credentials are encrypted at rest and never shown again after saving. Used by the
          Invoices module for compliant e-VAT submission — only business owners should manage
          these.
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {configured && (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => clearMutation.mutate()}
          >
            {clearMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
            Remove credentials
          </Button>
        )}
        <Button type="button" disabled={busy} onClick={handleSave}>
          {saveMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
          Save VSDC credentials
        </Button>
      </div>
    </SettingsSection>
  );
}
