"use client";

import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { ImagePlus, Package, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

interface InventoryPhotoFieldProps {
  itemType: "product" | "service";
  name?: string;
  existingUrl?: string | null;
  pendingFile?: File | null;
  onPendingFileChange?: (file: File | null) => void;
  onUpload?: (file: File) => void;
  isUploading?: boolean;
  /** Full-width preview for sidebar layouts */
  wide?: boolean;
  className?: string;
}

export function InventoryPhotoField({
  itemType,
  name,
  existingUrl,
  pendingFile,
  onPendingFileChange,
  onUpload,
  isUploading = false,
  wide = false,
  className,
}: InventoryPhotoFieldProps) {
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

  const displaySrc = localPreview ?? (existingUrl ? resolveMediaUrl(existingUrl) : null);
  const Icon = itemType === "product" ? Package : Wrench;
  const initial = (name?.trim() || (itemType === "product" ? "P" : "S"))[0]?.toUpperCase();

  function handleFile(file: File | undefined) {
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
    <div className={cn("flex flex-col gap-3", wide ? "w-full" : "items-center", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg border-2 border-dashed",
          "bg-muted/30 overflow-hidden transition-colors",
          wide ? "aspect-[4/3] w-full" : "h-36 w-36",
          displaySrc ? "border-primary/30" : "border-muted-foreground/25",
        )}
      >
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displaySrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground px-4 text-center">
            <Icon className="h-10 w-10 opacity-40" />
            <span className="text-xs">No photo yet</span>
          </div>
        )}
        {displaySrc && onPendingFileChange && pendingFile && (
          <button
            type="button"
            onClick={clearPending}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 border shadow-sm hover:bg-muted"
            aria-label="Remove photo"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Spinner className="h-6 w-6" />
          </div>
        )}
      </div>

      {!displaySrc && initial && !wide ? (
        <p className="text-xs text-muted-foreground -mt-1 text-center">
          Preview uses first letter until you add a photo
        </p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn("gap-1.5", wide ? "w-full" : "w-full max-w-[200px]")}
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
        {displaySrc ? "Change photo" : "Add photo"}
      </Button>
      <p className={cn("text-[11px] text-muted-foreground leading-snug", wide ? "text-left" : "text-center max-w-[200px]")}>
        JPEG, PNG or WebP · max 2 MB
        {onPendingFileChange && !onUpload ? " · uploads when you save" : ""}
      </p>
    </div>
  );
}
