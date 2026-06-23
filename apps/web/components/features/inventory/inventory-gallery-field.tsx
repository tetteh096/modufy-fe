"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_GALLERY = 12;

function validateImage(file: File): boolean {
  if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
    toast.error("Use JPEG, PNG, or WebP");
    return false;
  }
  if (file.size > MAX_BYTES) {
    toast.error("Image must be under 2 MB");
    return false;
  }
  return true;
}

export function InventoryGalleryField({
  itemId,
  coverUrl,
  galleryUrls,
  className,
}: {
  itemId: string;
  coverUrl?: string | null;
  galleryUrls: string[];
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const extraImages = galleryUrls.filter((url) => url && url !== coverUrl);
  const totalCount = (coverUrl ? 1 : 0) + extraImages.length;
  const atLimit = totalCount >= MAX_GALLERY;

  const uploadMutation = useMutation({
    mutationFn: (file: File) => inventoryApi.uploadGalleryPhoto(itemId, file),
    onSuccess: () => {
      toast.success("Photo added to gallery");
      queryClient.invalidateQueries({ queryKey: ["inventory", itemId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const removeMutation = useMutation({
    mutationFn: (url: string) => inventoryApi.removeGalleryPhoto(itemId, url),
    onSuccess: () => {
      toast.success("Photo removed");
      queryClient.invalidateQueries({ queryKey: ["inventory", itemId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    if (!validateImage(file)) return;
    uploadMutation.mutate(file);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Gallery photos</p>
        <span className="text-xs text-muted-foreground tabular-nums">
          {totalCount} / {MAX_GALLERY}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Add extra shots for your storefront — flat lay, detail, lifestyle. The cover photo above is always shown first.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {extraImages.map((url) => {
          const src = resolveMediaUrl(url);
          return (
            <div key={url} className="relative aspect-square rounded-lg border overflow-hidden bg-muted/30 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeMutation.mutate(url)}
                disabled={removeMutation.isPending}
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        {!atLimit ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            {uploadMutation.isPending ? (
              <Spinner className="h-5 w-5" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px] font-medium">Add photo</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
