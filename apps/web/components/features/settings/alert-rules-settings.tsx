"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { AlertRule } from "@/types/api";

const CATEGORY_LABELS: Record<string, string> = {
  invoices: "Invoices & payments",
  inventory: "Inventory",
  appointments: "Appointments",
  tax: "Tax & compliance",
};

const CATEGORY_ORDER = ["invoices", "inventory", "appointments", "tax"];

type AlertRuleRowProps = {
  rule: AlertRule;
  onSave: (eventType: string, patch: Partial<AlertRule>) => void;
  saving: boolean;
};

function AlertRuleRow({ rule, onSave, saving }: AlertRuleRowProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">{rule.label}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rule.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input
            id={`enabled-${rule.event_type}`}
            type="checkbox"
            className="h-4 w-4 rounded border-input accent-primary"
            checked={rule.enabled}
            disabled={saving}
            onChange={(e) => onSave(rule.event_type, { enabled: e.target.checked })}
          />
        </div>
      </div>

      {rule.enabled && (
        <div className="flex flex-wrap gap-4 pt-1 border-t border-dashed border-border/60">
          {rule.event_type === "invoice_due_soon" && (
            <div className="space-y-1.5">
              <Label htmlFor={`days-${rule.event_type}`} className="text-xs">
                Days before due date
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`days-${rule.event_type}`}
                  type="number"
                  min={1}
                  max={90}
                  className="h-8 w-20"
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
            <div className="space-y-1.5">
              <Label htmlFor={`hours-${rule.event_type}`} className="text-xs">
                Hours before start
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`hours-${rule.event_type}`}
                  type="number"
                  min={1}
                  max={168}
                  className="h-8 w-20"
                  defaultValue={rule.hours_before || 24}
                  disabled={saving}
                  onBlur={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isNaN(n) && n !== rule.hours_before) {
                      onSave(rule.event_type, { hours_before: n });
                    }
                  }}
                />
                <span className="text-xs text-muted-foreground">hours</span>
              </div>
            </div>
          )}

          {rule.event_type === "tax_filing_due" && (
            <div className="space-y-1.5">
              <Label htmlFor={`dom-${rule.event_type}`} className="text-xs">
                Remind from day of month
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`dom-${rule.event_type}`}
                  type="number"
                  min={1}
                  max={28}
                  className="h-8 w-20"
                  defaultValue={rule.day_of_month || 15}
                  disabled={saving}
                  onBlur={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isNaN(n) && n !== rule.day_of_month) {
                      onSave(rule.event_type, { day_of_month: n });
                    }
                  }}
                />
                <span className="text-xs text-muted-foreground">of each month</span>
              </div>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground self-end">
            Shows on your{" "}
            <Link href="/alerts" className="text-primary hover:underline">
              Alerts page
            </Link>
            {rule.in_app ? " and notification bell" : ""}
          </p>
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
      patch: Partial<Pick<AlertRule, "enabled" | "days_before" | "hours_before" | "day_of_month" | "in_app">>;
    }) => businessApi.alertRules.update(eventType, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-rules"] });
      queryClient.invalidateQueries({ queryKey: ["attention"] });
      toast.success("Alert rule updated");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const rules = data?.rules ?? [];
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat] ?? cat,
    rules: rules.filter((r) => r.category === cat),
  })).filter((g) => g.rules.length > 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center space-y-3">
        <p className="text-sm font-medium text-destructive">Could not load alert rules</p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          {getApiErrorMessage(error)}. If the API was just updated, stop the old server on port 8080 and restart it.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 px-4 py-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">No alert rules found — restart the API to seed defaults.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium text-primary hover:underline"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Default alert rules"
        description="These run automatically — no setup required. Toggle off what you don't need, or change timing."
        icon={Bell}
      >
        <p className="text-sm text-muted-foreground -mt-2 mb-4">
          Alerts appear on the{" "}
          <Link href="/alerts" className="text-primary font-medium hover:underline">
            Alerts page
          </Link>{" "}
          and dashboard. Invoice due-soon defaults to 3 days; VAT reminder defaults to the 15th of each month.
        </p>

        {grouped.map((group) => (
          <div key={group.category} className="space-y-3 mb-8 last:mb-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </h3>
            <div className="space-y-3">
              {group.rules.map((rule) => (
                <AlertRuleRow
                  key={rule.event_type}
                  rule={rule}
                  saving={updateMutation.isPending}
                  onSave={(eventType, patch) =>
                    updateMutation.mutate({ eventType, patch })
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </SettingsSection>

      <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
        SMS and WhatsApp delivery for alerts is coming soon. In-app alerts and the Alerts page are active now.
      </div>
    </div>
  );
}
