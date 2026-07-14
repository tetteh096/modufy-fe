"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { Store, ExternalLink, Copy, Check, Globe, Sparkles } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsField } from "@/components/features/settings/settings-field";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import {
  storefrontSchema,
  businessToStorefront,
  STOREFRONT_BASE,
  type StorefrontForm,
} from "@/components/features/settings/settings-shared";
import { cn } from "@/lib/utils";

function StorefrontUrlPreview({
  slug,
  businessName,
}: {
  slug: string;
  businessName: string;
}) {
  const [copied, setCopied] = useState(false);
  const displaySlug = slug || "your-slug";
  const fullUrl = `${STOREFRONT_BASE}/${displaySlug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Storefront link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Live preview
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-xs">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/25 px-3 py-2.5">
          <span className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border/60 bg-background px-2.5 py-1.5">
            <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <p className="min-w-0 truncate font-mono text-xs text-foreground">{fullUrl}</p>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div>
            <p className="text-sm font-semibold">{businessName || "Your business"}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Public shop home when Marketplace is enabled
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={copyLink}
              disabled={!slug}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            {slug ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                nativeButton={false}
                render={
                  <Link href={`/p/${slug}`} target="_blank" rel="noopener noreferrer" />
                }
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open storefront
              </Button>
            ) : (
              <Button type="button" variant="outline" size="sm" className="gap-1.5" disabled>
                <ExternalLink className="h-3.5 w-3.5" />
                Open storefront
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StorefrontSettingsPage() {
  const queryClient = useQueryClient();
  const { data: business, isLoading } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<StorefrontForm>({
    resolver: zodResolver(storefrontSchema),
  });

  const slug = watch("slug") ?? "";

  useEffect(() => {
    if (business) reset(businessToStorefront(business));
  }, [business, reset]);

  const updateMutation = useMutation({
    mutationFn: businessApi.update,
    onSuccess: (updated) => {
      toast.success("Storefront URL saved");
      queryClient.setQueryData(["business"], updated);
      reset(businessToStorefront(updated));
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const baseHost = useMemo(() => {
    try {
      return new URL(STOREFRONT_BASE).host;
    } catch {
      return "your-domain.com";
    }
  }, []);

  function normalizeSlugInput() {
    const raw = watch("slug");
    if (!raw) return;
    const normalized = raw
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (normalized) setValue("slug", normalized, { shouldDirty: true });
  }

  function onSubmit(data: StorefrontForm) {
    updateMutation.mutate({ slug: data.slug });
  }

  if (isLoading || !business) return <SectionLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <PageHeader
        title="Storefront"
        description="Public link for your online shop when Marketplace is enabled"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <SettingsSection
          title="Public URL"
          icon={Store}
          description="Customers will find you at this address"
        >
          <SettingsField
            label="Store URL slug"
            htmlFor="slug"
            hint="Lowercase letters, numbers, and hyphens only — e.g. new-stores"
            error={errors.slug?.message}
          >
            <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-xs">
              <div className="flex flex-col sm:flex-row">
                <span className="inline-flex items-center border-b border-border/60 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground sm:border-b-0 sm:border-r">
                  {baseHost}/p/
                </span>
                <Input
                  id="slug"
                  placeholder="new-stores"
                  className={cn(
                    "h-11 rounded-none border-0 bg-transparent px-4 text-base shadow-none focus-visible:ring-0 sm:text-sm",
                  )}
                  {...register("slug")}
                  onBlur={normalizeSlugInput}
                />
              </div>
            </div>
          </SettingsField>

          <StorefrontUrlPreview slug={slug} businessName={business.name} />
        </SettingsSection>

        <SettingsStickyFooter>
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty}
            onClick={() => reset(businessToStorefront(business))}
          >
            Discard
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting || updateMutation.isPending}>
            {(isSubmitting || updateMutation.isPending) && (
              <Spinner className="mr-2 h-4 w-4" />
            )}
            Save changes
          </Button>
        </SettingsStickyFooter>
      </form>
    </div>
  );
}
