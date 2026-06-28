"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, Mail, Clock, Info } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AlertRule } from "@/types/api";

const CATEGORY_LABELS: Record<string, string> = {
  invoices: "Invoices & payments",
  inventory: "Inventory",
  appointments: "Appointments",
  tax: "Tax & compliance",
};

const CATEGORY_ORDER = ["invoices", "inventory", "appointments", "tax"];

function RuleToggle({
  checked,
  disabled,
  onChange,
  id,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

type AlertRuleRowProps = {
  rule: AlertRule;
  onSave: (eventType: string, patch: Partial<AlertRule>) => void;
  saving: boolean;
};

function AlertRuleRow({ rule, onSave, saving }: AlertRuleRowProps) {
  return (
    <div
      className={cn(
        "rounded-lg border transition-colors",
        rule.enabled ? "border-border/80 bg-card" : "border-border/40 bg-muted/20 opacity-80",
      )}
    >
      <div className="flex items-start gap-4 p-4">
        <RuleToggle
          id={`enabled-${rule.event_type}`}
          checked={rule.enabled}
          disabled={saving}
          onChange={(enabled) => onSave(rule.event_type, { enabled })}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium leading-snug">{rule.label}</p>
            {rule.enabled && rule.email && (
              <Badge variant="secondary" className="text-[10px] gap-0.5 h-5 px-1.5">
                <Mail className="h-3 w-3" />
                Email
              </Badge>
            )}
            {rule.enabled && rule.in_app && (
              <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                In-app
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>
        </div>
      </div>

      {rule.enabled && (
        <div className="flex flex-wrap items-end gap-4 px-4 pb-4 pt-0 pl-[3.75rem] border-t border-dashed border-border/50 mx-4 mb-4 pt-3">
          {rule.event_type === "invoice_due_soon" && (
            <div className="space-y-1">
              <Label htmlFor={`days-${rule.event_type}`} className="text-[11px] text-muted-foreground">
                Days before due
              </Label>
              <div className="flex items-center gap-1.5">
                <Input
                  id={`days-${rule.event_type}`}
                  type="number"
                  min={1}
                  max={90}
                  className="h-8 w-16 text-center"
                  defaultValue={rule.days_before || 3}
                  disabled={saving}
                  onBlur={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isNaN(n) && n !== rule.days_before) {
                      onSave(rule.event_type, { days_before: n });
                    }
                  }}
                />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>
          )}

          {rule.event_type === "appointment_upcoming" && (
            <div className="space-y-1">
              <Label htmlFor={`hours-${rule.event_type}`} className="text-[11px] text-muted-foreground">
                Hours before start
              </Label>
              <div className="flex items-center gap-1.5">
                <Input
                  id={`hours-${rule.event_type}`}
                  type="number"
                  min={1}
                  max={168}
                  className="h-8 w-16 text-center"
                  defaultValue={rule.hours_before || 24}
                  disabled={saving}
                  onBlur={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isNaN(n) && n !== rule.hours_before) {
                      onSave(rule.event_type, { hours_before: n });
                    }
                  }}
                />
                <span className="text-xs text-muted-foreground">hrs</span>
              </div>
            </div>
          )}

          {rule.event_type === "tax_filing_due" && (
            <div className="space-y-1">
              <Label htmlFor={`dom-${rule.event_type}`} className="text-[11px] text-muted-foreground">
                Day of month
              </Label>
              <div className="flex items-center gap-1.5">
                <Input
                  id={`dom-${rule.event_type}`}
                  type="number"
                  min={1}
                  max={28}
                  className="h-8 w-16 text-center"
                  defaultValue={rule.day_of_month || 15}
                  disabled={saving}
                  onBlur={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isNaN(n) && n !== rule.day_of_month) {
                      onSave(rule.event_type, { day_of_month: n });
                    }
                  }}
                />
                <span className="text-xs text-muted-foreground">of month</span>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-xs cursor-pointer select-none pb-1">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary"
              checked={rule.email}
              disabled={saving}
              onChange={(e) => onSave(rule.event_type, { email: e.target.checked })}
            />
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Email me
          </label>
        </div>
      )}
    </div>
  );
}

export function AlertRulesSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["alert-rules"],
    queryFn: () => businessApi.alertRules.list(),
    retry: 2,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      eventType,
      patch,
    }: {
      eventType: string;
      patch: Partial<Pick<AlertRule, "enabled" | "days_before" | "hours_before" | "day_of_month" | "in_app" | "email">>;
    }) => businessApi.alertRules.update(eventType, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-rules"] });
      queryClient.invalidateQueries({ queryKey: ["attention"] });
      toast.success("Alert updated");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const rules = data?.rules ?? [];
  const enabledCount = rules.filter((r) => r.enabled).length;
  const emailCount = rules.filter((r) => r.enabled && r.email).length;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat] ?? cat,
    rules: rules.filter((r) => r.category === cat),
  })).filter((g) => g.rules.length > 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center space-y-3">
        <p className="text-sm font-medium text-destructive">Could not load alert rules</p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">{getApiErrorMessage(error)}</p>
        <button type="button" onClick={() => refetch()} className="text-sm font-medium text-primary hover:underline">
          Try again
        </button>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        No alert rules found — restart the API to seed defaults.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Notification rules"
        description="Choose what Modufy watches for you. Enabled rules show on your Alerts page and notification bell."
        icon={Bell}
        contentClassName="space-y-6"
      >
        <div className="flex flex-wrap gap-3 -mt-2">
          <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs">
            <span className="font-semibold text-foreground tabular-nums">{enabledCount}</span>
            <span className="text-muted-foreground"> rules active</span>
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs">
            <span className="font-semibold text-foreground tabular-nums">{emailCount}</span>
            <span className="text-muted-foreground"> sending email</span>
          </div>
          <Link
            href="/alerts"
            className="rounded-lg border bg-muted/30 px-3 py-2 text-xs font-medium text-primary hover:bg-muted/50 transition-colors inline-flex items-center gap-1"
          >
            <Clock className="h-3.5 w-3.5" />
            View current alerts
          </Link>
        </div>

        {grouped.map((group) => (
          <div key={group.category} className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              {group.label}
            </h3>
            <div className="space-y-2">
              {group.rules.map((rule) => (
                <AlertRuleRow
                  key={rule.event_type}
                  rule={rule}
                  saving={updateMutation.isPending}
                  onSave={(eventType, patch) => updateMutation.mutate({ eventType, patch })}
                />
              ))}
            </div>
          </div>
        ))}
      </SettingsSection>

      <div className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-medium text-foreground">Email alerts</span> use Resend when you toggle
          &quot;Email me&quot;. SMS and WhatsApp for alerts are coming soon — customer Messages and
          appointment SMS already work from your credit balance.
        </p>
      </div>
    </div>
  );
}
