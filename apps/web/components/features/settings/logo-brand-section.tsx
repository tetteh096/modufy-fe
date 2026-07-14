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
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Live brand preview
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-md">
        {/* Mockup Header */}
        <div
          className="flex items-center justify-between gap-4 border-b px-5 py-4"
          style={{ borderBottomColor: `${accent}25`, background: `${accent}05` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-border/60 shadow-2xs" />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
                style={{ background: accent }}
              >
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground leading-tight">{business.name}</p>
              {business.tagline ? (
                <p className="truncate text-xs text-muted-foreground mt-0.5">{business.tagline}</p>
              ) : (
                <p className="truncate text-xs text-muted-foreground/60 mt-0.5">Your shop tagline goes here</p>
              )}
            </div>
          </div>
          
          {/* Simulated Search & Actions on Mockup */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-36 h-7 rounded-lg border border-border/50 bg-background/50 px-2.5 py-1 text-[10px] text-muted-foreground/70 select-none">
              Search products...
            </div>
            <div className="h-7 w-7 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center text-[10px] text-muted-foreground font-semibold">
              U
            </div>
          </div>
        </div>

        {/* Mockup Cards Grid */}
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {/* Mockup Invoice Card */}
          <div className="rounded-xl border border-border/60 bg-muted/10 p-4.5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Invoice Layout
              </p>
              <span className="text-[9px] font-bold text-muted-foreground/75 px-1.5 py-0.5 bg-background rounded border border-border/40">
                Receipt
              </span>
            </div>
            <div className="pt-2.5 border-t border-dashed border-border/50 flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-1.5 w-12 rounded-full" style={{ background: accent }} />
                <div className="h-2 w-full max-w-[85%] rounded bg-muted/40" />
                <div className="h-2 w-full max-w-[60%] rounded bg-muted/30" />
              </div>
              <div 
                className="h-8 px-2 rounded-lg font-mono text-xs font-semibold flex items-center justify-center shadow-3xs"
                style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}25` }}
              >
                $128.50
              </div>
            </div>
          </div>

          {/* Mockup Storefront Action Card */}
          <div className="rounded-xl border border-border/60 bg-muted/10 p-4.5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Storefront Actions
              </p>
              <span className="text-[9px] font-bold text-muted-foreground/75 px-1.5 py-0.5 bg-background rounded border border-border/40">
                Buttons
              </span>
            </div>
            <div className="pt-2.5 border-t border-dashed border-border/50 flex flex-col justify-center gap-1.5">
              <div className="h-2 w-16 rounded bg-muted/40" />
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex rounded-lg px-3.5 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  style={{ background: accent }}
                  onClick={(e) => e.preventDefault()}
                >
                  Shop now
                </button>
                <button
                  type="button"
                  className="inline-flex rounded-lg border px-3.5 py-2 text-[11px] font-bold transition-all hover:bg-muted/15 active:scale-95 cursor-pointer"
                  style={{ borderColor: `${accent}40`, color: accent }}
                  onClick={(e) => e.preventDefault()}
                >
                  Contact
                </button>
              </div>
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
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsField
          label="Business logo"
          hint="Square images work best. JPEG, PNG or WebP · max 2 MB"
        >
          <div className="rounded-xl border border-border/60 bg-muted/5 p-6 flex flex-col justify-center h-full">
            <button
              type="button"
              disabled={uploadMutation.isPending}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "group relative mx-auto flex w-full max-w-[240px] flex-col items-center gap-4 rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer",
                "border-border/80 bg-background hover:border-primary/45 hover:bg-primary/[0.02]",
                uploadMutation.isPending && "pointer-events-none opacity-70",
              )}
            >
              <div
                className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-muted/20 shadow-sm ring-1 ring-border/50 group-hover:scale-105 transition-transform duration-200"
                style={{ boxShadow: `0 8px 24px -10px ${accent}66` }}
              >
                {logoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoSrc} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground/60 select-none">
                    {business.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                  {uploadMutation.isPending ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-foreground" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
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
                className="mx-auto mt-4 flex gap-1.5 shadow-2xs font-semibold cursor-pointer"
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
          <div className="space-y-5 rounded-xl border border-border/60 bg-muted/5 p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 shrink-0 rounded-xl shadow-md ring-1 ring-border/50 transition-transform duration-200"
                style={{ background: accent, boxShadow: `0 6px 16px -6px ${accent}66` }}
              />
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <input
                  id="brand_color"
                  type="color"
                  value={accent}
                  onChange={(e) => onBrandColorChange(e.target.value.toUpperCase())}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1 hover:border-primary/30 transition-colors"
                  aria-label="Pick brand colour"
                />
                <Input
                  value={accent}
                  onChange={(e) => onBrandColorChange(normalizeHexInput(e.target.value))}
                  onBlur={(e) => onBrandColorChange(normalizeHexInput(e.target.value))}
                  className="h-10 font-mono text-sm uppercase shadow-2xs focus-visible:ring-primary/20 focus-visible:border-primary/50"
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick picks</p>
              <div className="flex flex-wrap gap-2.5">
                {BRAND_COLOR_PRESETS.map(({ hex, name }) => {
                  const selected = accent.toUpperCase() === hex.toUpperCase();
                  return (
                    <button
                      key={hex}
                      type="button"
                      title={name}
                      onClick={() => onBrandColorChange(hex)}
                      className={cn(
                        "relative h-9 w-9 rounded-full border-2 shadow-2xs hover:scale-110 transition-transform cursor-pointer",
                        selected
                          ? "border-foreground ring-2 ring-foreground/25 ring-offset-2 ring-offset-background"
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
