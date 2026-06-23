"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ImagePlus, Palette, Sparkles } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsField } from "@/components/features/settings/settings-field";
import { BRAND_COLOR_PRESETS } from "@/components/features/settings/settings-shared";
import { cn } from "@/lib/utils";
import type { Business } from "@/types/api";

interface LogoBrandSectionProps {
  business: Business;
  brandColor: string;
  onBrandColorChange: (color: string) => void;
}

function normalizeHexInput(value: string): string {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) return `#${trimmed.toUpperCase()}`;
  return trimmed;
}

function BrandPreview({
  business,
  brandColor,
  logoSrc,
}: {
  business: Business;
  brandColor: string;
  logoSrc: string | null;
}) {
  const accent = brandColor || "#1E40AF";
  const initial = business.name.charAt(0).toUpperCase();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Live preview
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-xs">
        <div
          className="flex items-center gap-3 border-b px-4 py-3"
          style={{ borderBottomColor: `${accent}33`, background: `${accent}08` }}
        >
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-border/60" />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white shadow-xs"
              style={{ background: accent }}
            >
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{business.name}</p>
            {business.tagline && (
              <p className="truncate text-xs text-muted-foreground">{business.tagline}</p>
            )}
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Invoice header
            </p>
            <div className="mt-3 space-y-2">
              <div className="h-1 w-10 rounded-full" style={{ background: accent }} />
              <div className="h-2 w-full max-w-[85%] rounded bg-muted/80" />
              <div className="h-2 w-full max-w-[65%] rounded bg-muted/60" />
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Storefront button
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{ background: accent }}
              >
                Shop now
              </span>
              <span
                className="inline-flex rounded-md border px-2.5 py-1 text-[11px] font-medium"
                style={{ borderColor: `${accent}55`, color: accent }}
              >
                Contact
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LogoBrandSection({
  business,
  brandColor,
  onBrandColorChange,
}: LogoBrandSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: businessApi.uploadLogo,
    onSuccess: (updated) => {
      toast.success("Logo updated");
      queryClient.setQueryData(["business"], updated);
      setPreview(null);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
      setPreview(null);
    },
  });

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2 MB");
      return;
    }
    setPreview(URL.createObjectURL(file));
    uploadMutation.mutate(file);
    e.target.value = "";
  }

  const logoSrc = preview ?? business.logo_url ?? null;
  const accent = brandColor || "#1E40AF";

  return (
    <SettingsSection
      title="Logo & brand colour"
      icon={Palette}
      description="Your logo and accent colour on invoices, storefront, and customer-facing pages"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <SettingsField
          label="Business logo"
          hint="Square images work best. JPEG, PNG or WebP · max 2 MB"
        >
          <div className="rounded-xl border border-border/70 bg-muted/10 p-5">
            <button
              type="button"
              disabled={uploadMutation.isPending}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "group relative mx-auto flex w-full max-w-[220px] flex-col items-center gap-4 rounded-xl border-2 border-dashed p-6 transition-all",
                "border-border/80 bg-background/80 hover:border-primary/35 hover:bg-primary/[0.03]",
                uploadMutation.isPending && "pointer-events-none opacity-70",
              )}
            >
              <div
                className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl bg-muted/30 shadow-sm ring-1 ring-border/60"
                style={{ boxShadow: `0 8px 24px -8px ${accent}55` }}
              >
                {logoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoSrc} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground/80">
                    {business.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 transition-opacity group-hover:opacity-100">
                  {uploadMutation.isPending ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-foreground" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {logoSrc ? "Replace logo" : "Upload logo"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">Click to choose a file</p>
              </div>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onFileChange}
            />
            {!logoSrc && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mx-auto mt-4 flex gap-1.5"
                disabled={uploadMutation.isPending}
                onClick={() => inputRef.current?.click()}
              >
                {uploadMutation.isPending ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                Choose file
              </Button>
            )}
          </div>
        </SettingsField>

        <SettingsField
          label="Brand colour"
          htmlFor="brand_color"
          hint="Used for accents on your public storefront and documents"
        >
          <div className="space-y-5 rounded-xl border border-border/70 bg-muted/10 p-5">
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 shrink-0 rounded-xl shadow-sm ring-1 ring-border/60"
                style={{ background: accent }}
              />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  id="brand_color"
                  type="color"
                  value={accent}
                  onChange={(e) => onBrandColorChange(e.target.value.toUpperCase())}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-border/80 bg-transparent p-1"
                  aria-label="Pick brand colour"
                />
                <Input
                  value={accent}
                  onChange={(e) => onBrandColorChange(normalizeHexInput(e.target.value))}
                  onBlur={(e) => onBrandColorChange(normalizeHexInput(e.target.value))}
                  className="h-10 font-mono text-sm uppercase"
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-medium text-muted-foreground">Quick picks</p>
              <div className="flex flex-wrap gap-2">
                {BRAND_COLOR_PRESETS.map(({ hex, name }) => {
                  const selected = accent.toUpperCase() === hex.toUpperCase();
                  return (
                    <button
                      key={hex}
                      type="button"
                      title={name}
                      onClick={() => onBrandColorChange(hex)}
                      className={cn(
                        "relative h-9 w-9 rounded-full border-2 transition-transform hover:scale-105",
                        selected
                          ? "border-foreground ring-2 ring-foreground/20 ring-offset-2 ring-offset-background"
                          : "border-transparent",
                      )}
                      style={{ background: hex }}
                    >
                      {selected && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm" />
                      )}
                      <span className="sr-only">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SettingsField>
      </div>

      <BrandPreview business={business} brandColor={accent} logoSrc={logoSrc} />
    </SettingsSection>
  );
}
