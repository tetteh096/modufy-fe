"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, Palette, X } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { colorToHex } from "@/components/features/storefront/storefront-product-media";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/api";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

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

function uniqueColors(variants: ProductVariant[]): string[] {
  return [...new Set(variants.map((v) => v.color).filter(Boolean))];
}

function colorImageUrl(variants: ProductVariant[], color: string): string | undefined {
  return variants.find((v) => v.color === color && v.image_url)?.image_url;
}

function ColorPhotoRow({
  productId,
  color,
  imageUrl,
  uploading,
  onUploadStart,
  onUploadEnd,
}: {
  productId: string;
  color: string;
  imageUrl?: string;
  uploading: string | null;
  onUploadStart: (color: string) => void;
  onUploadEnd: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const src = imageUrl ? resolveMediaUrl(imageUrl) : null;
  const busy = uploading === color;

  const uploadMutation = useMutation({
    mutationFn: (file: File) => inventoryApi.uploadColorPhoto(productId, color, file),
    onSuccess: () => {
      toast.success(`Photo linked to ${color}`);
      queryClient.invalidateQueries({ queryKey: ["inventory", productId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", productId, "variants"] });
      onUploadEnd();
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e));
      onUploadEnd();
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => inventoryApi.clearColorPhoto(productId, color),
    onSuccess: () => {
      toast.success(`Removed ${color} photo`);
      queryClient.invalidateQueries({ queryKey: ["inventory", productId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", productId, "variants"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function pickFile(files: FileList | null) {
    const file = files?.[0];
    if (!file || !validateImage(file)) return;
    onUploadStart(color);
    uploadMutation.mutate(file);
  }

  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-3">
        <div className="flex items-center gap-2">
          <span
            className="h-5 w-5 rounded-full border shrink-0"
            style={{ background: colorToHex(color) }}
          />
          <span className="text-sm font-medium">{color}</span>
        </div>
      </td>
      <td className="py-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-muted/30 overflow-hidden">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={color} className="h-full w-full object-cover" />
          ) : (
            <Palette className="h-5 w-5 text-muted-foreground/40" />
          )}
        </div>
      </td>
      <td className="py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              pickFile(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            disabled={busy || clearMutation.isPending}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Spinner className="h-3.5 w-3.5" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {src ? "Change" : "Add"}
          </Button>
          {src ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              disabled={clearMutation.isPending}
              onClick={() => clearMutation.mutate()}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

export function InventoryColorPhotos({
  productId,
  variants,
  className,
}: {
  productId: string;
  variants: ProductVariant[];
  className?: string;
}) {
  const colors = uniqueColors(variants);
  const [uploading, setUploading] = useState<string | null>(null);

  if (colors.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="text-sm font-medium flex items-center gap-1.5">
          <Palette className="h-4 w-4 text-primary" />
          Colour photos
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Link a photo to each colour — all photos appear in the product gallery so shoppers can browse them.
          Tapping a colour photo also selects that colour. Your cover photo still shows on the shop grid.
        </p>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">Colour</th>
              <th className="px-3 py-2 text-left font-medium">Preview</th>
              <th className="px-3 py-2 text-right font-medium">Photo</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <ColorPhotoRow
                key={color}
                productId={productId}
                color={color}
                imageUrl={colorImageUrl(variants, color)}
                uploading={uploading}
                onUploadStart={setUploading}
                onUploadEnd={() => setUploading(null)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
