"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImageIcon, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/shared/spinner";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

type BlogCoverFieldProps = {
  title?: string;
  imageUrl?: string;
  onImageUrlChange: (url: string) => void;
  pendingFile?: File | null;
  onPendingFileChange?: (file: File | null) => void;
  onUpload?: (file: File) => void;
  isUploading?: boolean;
  className?: string;
};

export function BlogCoverField({
  title,
  imageUrl,
  onImageUrlChange,
  pendingFile,
  onPendingFileChange,
  onUpload,
  isUploading = false,
  className,
}: BlogCoverFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingFile) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  const storedPreview = imageUrl ? resolveMediaUrl(imageUrl) : "";
  const displaySrc = localPreview || storedPreview || null;

  function validateAndHandle(file: File | undefined) {
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error("Use JPEG, PNG, or WebP");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be under 2 MB");
      return;
    }
    if (onUpload) {
      onUpload(file);
      return;
    }
    onPendingFileChange?.(file);
  }

  function clearPending() {
    onPendingFileChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted/30",
          displaySrc ? "border-primary/30" : "border-dashed border-muted-foreground/25",
        )}
      >
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displaySrc} alt={title || "Cover preview"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-40" />
            <p className="text-sm">Upload a cover for your article</p>
          </div>
        )}
        {pendingFile && onPendingFileChange ? (
          <button
            type="button"
            onClick={clearPending}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border bg-background/90 shadow-sm hover:bg-muted"
            aria-label="Remove cover"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Spinner className="h-7 w-7" />
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(event) => {
          validateAndHandle(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? <Spinner className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
        {displaySrc ? "Change cover image" : "Upload cover image"}
      </Button>

      <p className="text-[11px] leading-snug text-muted-foreground">
        JPEG, PNG or WebP · max 2 MB
        {onPendingFileChange && !onUpload ? " · uploads when you save the draft" : ""}
      </p>

      <div className="space-y-2">
        <Label htmlFor="featured_image_url" className="text-xs text-muted-foreground">
          Or paste an image URL
        </Label>
        <Input
          id="featured_image_url"
          value={imageUrl ?? ""}
          onChange={(event) => onImageUrlChange(event.target.value)}
          placeholder="https://images.example.com/cover.jpg"
        />
      </div>
    </div>
  );
}
