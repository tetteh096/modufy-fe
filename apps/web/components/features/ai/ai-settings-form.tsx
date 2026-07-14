"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wallet, KeyRound, Gauge } from "lucide-react";
import { aiApi, getApiErrorMessage } from "@/lib/api";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsField } from "@/components/features/settings/settings-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionLoader } from "@/components/shared/page-loader";

const schema = z.object({
  key_mode: z.enum(["managed", "byo"]),
  byo_provider: z.enum(["anthropic", "openai"]),
  api_key: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof schema>;

const money = (n: number) => `$${n.toFixed(2)}`;

export function AISettingsForm() {
  const qc = useQueryClient();

  const settings = useQuery({ queryKey: ["ai-settings"], queryFn: aiApi.getSettings });
  const usage = useQuery({ queryKey: ["ai-usage"], queryFn: aiApi.getUsage });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      key_mode: "managed",
      byo_provider: "anthropic",
      api_key: "",
    },
  });
  const { register, handleSubmit, control, reset, watch, formState } = form;

  useEffect(() => {
    if (settings.data) {
      reset({
        key_mode: settings.data.key_mode,
        byo_provider: settings.data.byo_provider ?? "anthropic",
        api_key: "",
      });
    }
  }, [settings.data, reset]);

  const mutation = useMutation({
    mutationFn: aiApi.updateSettings,
    onSuccess: () => {
      toast.success("AI settings saved");
      qc.invalidateQueries({ queryKey: ["ai-settings"] });
      qc.invalidateQueries({ queryKey: ["ai-usage"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const onSubmit = (values: FormValues) => {
    const body = {
      key_mode: values.key_mode,
      ...(values.key_mode === "byo" ? { byo_provider: values.byo_provider } : {}),
      ...(values.api_key ? { api_key: values.api_key } : {}),
    };
    mutation.mutate(body);
  };

  if (settings.isLoading) return <SectionLoader />;

  const keyMode = watch("key_mode");
  const u = usage.data;
  const usedPct =
    u && u.cost_limit_usd > 0 ? Math.min(100, (u.cost_used / u.cost_limit_usd) * 100) : 0;

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Spend"
        description="Your AI usage this period and the cap that protects you from runaway cost."
        icon={Wallet}
      >
        {u ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {money(u.cost_used)} of {money(u.cost_limit_usd)} used ({u.period})
              </span>
              {u.in_economy ? (
                <Badge variant="secondary">Economy mode</Badge>
              ) : (
                <Badge variant="outline">{money(u.remaining)} left</Badge>
              )}
            </div>
            <Progress value={usedPct} />
            <p className="text-xs text-muted-foreground">
              At {Math.round(u.soft_pct * 100)}% the assistant switches to the cheapest model
              automatically; at 100% it pauses until next period.
            </p>
            {u.recent && u.recent.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Recent calls</p>
                {u.recent.slice(0, 6).map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"
                  >
                    <span className="font-medium">{r.feature}</span>
                    <span className="text-muted-foreground">
                      {r.provider}/{r.tier}
                      {r.degraded ? " · economy" : ""}
                    </span>
                    <span className="tabular-nums">{money(r.cost_usd)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No usage yet this period.</p>
        )}
      </SettingsSection>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Budget limit is configured and managed by the Super Admin */}

        <SettingsSection
          title="Billing mode"
          description="Use the platform's keys (metered against your budget) or bring your own (billed to you by the provider)."
          icon={KeyRound}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <SettingsField label="Key mode" htmlFor="key_mode">
              <Controller
                control={control}
                name="key_mode"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v as string)}>
                    <SelectTrigger id="key_mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="managed">Managed (billed to your budget)</SelectItem>
                      <SelectItem value="byo">Bring your own key</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </SettingsField>

            {keyMode === "byo" && (
              <SettingsField label="Provider" htmlFor="byo_provider">
                <Controller
                  control={control}
                  name="byo_provider"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => field.onChange(v as string)}>
                      <SelectTrigger id="byo_provider">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </SettingsField>
            )}
          </div>

          {keyMode === "byo" && (
            <SettingsField
              label="API key"
              htmlFor="api_key"
              hint={
                settings.data?.has_key
                  ? "A key is stored. Leave blank to keep it, or paste a new one to replace."
                  : "Paste your provider API key. Stored encrypted; never shown again."
              }
            >
              <Input id="api_key" type="password" placeholder="sk-..." {...register("api_key")} />
            </SettingsField>
          )}
        </SettingsSection>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
