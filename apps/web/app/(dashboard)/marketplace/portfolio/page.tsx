"use client";

import { useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ImageIcon, LayoutTemplate, Sparkles, Trash2, Upload } from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { PortfolioImage } from "@/types/api";
import { cn } from "@/lib/utils";

function placementSummary(img: PortfolioImage) {
  const tags: string[] = [];
  if (img.use_hero) tags.push("Hero");
  if (img.use_editorial) tags.push("Story");
  return tags;
}

function PortfolioCard({ img }: { img: PortfolioImage }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (body: { use_hero?: boolean; use_editorial?: boolean; caption?: string }) =>
      marketplaceApi.portfolio.update(img.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-portfolio"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => marketplaceApi.portfolio.delete(img.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-portfolio"] });
      toast.success("Image removed");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const tags = placementSummary(img);
  const unused = tags.length === 0;

  function toggleHero(checked: boolean) {
    updateMutation.mutate({ use_hero: checked });
  }

  function toggleEditorial(checked: boolean) {
    updateMutation.mutate({ use_editorial: checked });
  }

  function saveCaption(value: string) {
    if (value === (img.caption ?? "")) return;
    updateMutation.mutate({ caption: value });
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card",
        unused && "border-dashed opacity-90",
      )}
    >
      <div className="relative aspect-[4/3] bg-muted">
        <img src={img.url} alt={img.caption || "Portfolio"} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive"
          title="Remove image"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        {tags.length > 0 ? (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {tags.map((t) => (
              <Badge key={t} className="border-0 bg-black/55 text-white text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        ) : (
          <Badge
            variant="secondary"
            className="absolute left-2 top-2 border-0 bg-black/45 text-white text-[10px]"
          >
            Library only
          </Badge>
        )}
      </div>

      <div className="space-y-3 p-3">
        <div className="space-y-1.5">
          <Label htmlFor={`caption-${img.id}`} className="text-xs text-muted-foreground">
            Caption (optional)
          </Label>
          <Input
            id={`caption-${img.id}`}
            defaultValue={img.caption}
            placeholder="e.g. Summer collection"
            className="h-8 text-sm"
            onBlur={(e) => saveCaption(e.target.value.trim())}
          />
        </div>

        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          Show on storefront
        </p>

        <div className="space-y-2">
          <label className="flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer hover:bg-muted/40">
            <Checkbox
              checked={img.use_hero}
              disabled={updateMutation.isPending}
              onCheckedChange={(v) => toggleHero(v === true)}
            />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground" />
                Homepage hero slider
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                Full-width rotating banner at the top of your shop
              </span>
            </span>
          </label>

          <label className="flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer hover:bg-muted/40">
            <Checkbox
              checked={img.use_editorial}
              disabled={updateMutation.isPending}
              onCheckedChange={(v) => toggleEditorial(v === true)}
            />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                Story sections
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                Large lifestyle images in category story blocks on the homepage
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePortfolioPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ["marketplace-portfolio"],
    queryFn: marketplaceApi.portfolio.list,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      return marketplaceApi.portfolio.upload(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-portfolio"] });
      toast.success("Photo uploaded — choose where to use it below");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = "";
  }

  const heroCount = images?.filter((i) => i.use_hero).length ?? 0;
  const storyCount = images?.filter((i) => i.use_editorial).length ?? 0;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Photos"
        description="Upload images to your library, then tick where each one should appear on your storefront"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/marketplace" />}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to storefront
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadMutation.isPending ? "Uploading…" : "Upload photo"}
            </Button>
          </div>
        }
      />

      {images && images.length > 0 ? (
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{images.length} in library</span>
          <span>·</span>
          <span>{heroCount} on hero slider</span>
          <span>·</span>
          <span>{storyCount} in story sections</span>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      ) : !images?.length ? (
        <EmptyState
          icon={<ImageIcon className="h-8 w-8" />}
          title="No photos yet"
          description="Upload landscape photos first. You can assign them to the hero slider, story sections, or keep them in your library until you're ready."
          action={
            <Button size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload first photo
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <PortfolioCard key={img.id} img={img} />
          ))}
        </div>
      )}
    </div>
  );
}
