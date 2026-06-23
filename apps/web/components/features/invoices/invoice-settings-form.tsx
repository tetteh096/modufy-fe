"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, LayoutTemplate, Eye } from "lucide-react";
import Link from "next/link";
import { invoicesApi, getApiErrorMessage } from "@/lib/api";
import type { InvoiceTemplate } from "@/types/api";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const schema = z.object({
  template: z.enum(["modern", "classic", "minimal"]),
  number_prefix: z.string().min(1).max(20),
  default_terms: z.string(),
  default_footer: z.string(),
  default_payment_days: z.coerce.number().min(1).max(365),
});

type FormValues = z.infer<typeof schema>;

const TEMPLATES: {
  id: InvoiceTemplate;
  name: string;
  description: string;
}[] = [
  { id: "modern", name: "Modern", description: "Clean accent line, grey table header" },
  { id: "classic", name: "Classic", description: "Bold branded header band, bordered grid" },
  { id: "minimal", name: "Minimal", description: "Light typography, airy line list" },
];

export function InvoiceSettingsForm() {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["invoice-settings"],
    queryFn: invoicesApi.settings.get,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
  });

  const template = watch("template");

  useEffect(() => {
    if (settings) {
      reset({
        template: settings.template,
        number_prefix: settings.number_prefix,
        default_terms: settings.default_terms ?? "",
        default_footer: settings.default_footer ?? "",
        default_payment_days: settings.default_payment_days,
      });
    }
  }, [settings, reset]);

  const saveMutation = useMutation({
    mutationFn: invoicesApi.settings.update,
    onSuccess: () => {
      toast.success("Invoice settings saved");
      queryClient.invalidateQueries({ queryKey: ["invoice-settings"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  async function loadPreview(tpl?: InvoiceTemplate) {
    setPreviewLoading(true);
    try {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const blob = await invoicesApi.settings.previewPdf(tpl ?? template);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setPreviewLoading(false);
    }
  }

  useEffect(() => {
    if (settings && template) {
      void loadPreview(template);
    }
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.business_name, template]);

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((d) => saveMutation.mutate(d))}
      className="space-y-8 pb-24"
    >
      <SettingsSection
        title="PDF template"
        icon={LayoutTemplate}
        description="Premium layouts — applied to every invoice PDF"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setValue("template", t.id, { shouldDirty: true });
                void loadPreview(t.id);
              }}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                template === t.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:bg-muted/50"
              )}
            >
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Logo and brand colour come from{" "}
          <Link href="/settings/branding" className="text-primary hover:underline">
            Branding settings
          </Link>
          .
        </p>
      </SettingsSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsSection
          title="Defaults"
          icon={FileText}
          description="Pre-filled when creating new invoices"
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="number_prefix">Number prefix</Label>
                <Input id="number_prefix" {...register("number_prefix")} placeholder="INV" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default_payment_days">Payment terms (days)</Label>
                <Input
                  id="default_payment_days"
                  type="number"
                  min={1}
                  {...register("default_payment_days")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_terms">Default terms</Label>
              <Textarea
                id="default_terms"
                rows={3}
                className="resize-none"
                placeholder="Payment due within 14 days…"
                {...register("default_terms")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_footer">Default footer / notes</Label>
              <Textarea
                id="default_footer"
                rows={2}
                className="resize-none"
                placeholder="Thank you for your business."
                {...register("default_footer")}
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Live preview"
          icon={Eye}
          description="Sample invoice with your branding"
        >
          <div className="rounded-lg border bg-muted/30 overflow-hidden min-h-[320px] flex items-center justify-center">
            {previewLoading ? (
              <Spinner className="h-8 w-8" />
            ) : previewUrl ? (
              <iframe
                title="Invoice preview"
                src={previewUrl}
                className="w-full h-[420px] bg-white"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Preview unavailable</p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => void loadPreview()}
            disabled={previewLoading}
          >
            Refresh preview
          </Button>
        </SettingsSection>
      </div>

      <SettingsStickyFooter>
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty}
          onClick={() =>
            settings &&
            reset({
              template: settings.template,
              number_prefix: settings.number_prefix,
              default_terms: settings.default_terms ?? "",
              default_footer: settings.default_footer ?? "",
              default_payment_days: settings.default_payment_days,
            })
          }
        >
          Discard
        </Button>
        <Button type="submit" disabled={!isDirty || isSubmitting || saveMutation.isPending}>
          {(isSubmitting || saveMutation.isPending) && <Spinner className="mr-2 h-4 w-4" />}
          Save settings
        </Button>
      </SettingsStickyFooter>
    </form>
  );
}
