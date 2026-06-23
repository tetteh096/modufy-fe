"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { Spinner } from "@/components/shared/spinner";
import { cn } from "@/lib/utils";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";
export const MAX_GALLERY_PHOTOS = 12;

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

export function InventoryGalleryPendingField({
  pendingFiles,
  onPendingFilesChange,
  hasCover,
  className,
}: {
  pendingFiles: File[];
  onPendingFilesChange: (files: File[]) => void;
  hasCover: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = pendingFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [pendingFiles]);

  const totalCount = (hasCover ? 1 : 0) + pendingFiles.length;
  const atLimit = totalCount >= MAX_GALLERY_PHOTOS;

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = [...pendingFiles];
    for (const file of Array.from(files)) {
      const count = (hasCover ? 1 : 0) + next.length;
      if (count >= MAX_GALLERY_PHOTOS) {
        toast.error(`Maximum ${MAX_GALLERY_PHOTOS} photos including cover`);
        break;
      }
      if (!validateImage(file)) continue;
      next.push(file);
    }
    onPendingFilesChange(next);
  }

  function removeAt(index: number) {
    onPendingFilesChange(pendingFiles.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Gallery photos</p>
        <span className="text-xs text-muted-foreground tabular-nums">
          {totalCount} / {MAX_GALLERY_PHOTOS}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Optional extra shots for your storefront — detail, lifestyle, angles. Uploads when you save.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {previews.map((src, i) => (
          <div key={src} className="relative aspect-square rounded-lg border overflow-hidden bg-muted/30 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {!atLimit ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-[10px] font-medium">Add photo</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
