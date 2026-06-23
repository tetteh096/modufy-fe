"use client";

import { PenLine } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

type BlogCoverImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  accent?: string;
  fallback?: string;
};

export function BlogCoverImage({
  src,
  alt,
  className = "",
  accent = "#16a34a",
  fallback,
}: BlogCoverImageProps) {
  const resolved = src ? resolveMediaUrl(src) : null;

  if (resolved) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={resolved} alt={alt} className={className} loading="lazy" />
    );
  }

  const initial = (fallback || alt || "B").trim().charAt(0).toUpperCase() || "B";

  return (
    <div
      className={cn(
        "sf-blog-cover-placeholder flex flex-col items-center justify-center gap-2 w-full h-full min-h-full",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 18%, white) 0%, color-mix(in srgb, ${accent} 8%, #f4f6f8) 100%)`,
        color: accent,
      }}
      aria-hidden
    >
      <span className="opacity-45">
        <PenLine className="h-8 w-8" />
      </span>
      <span className="text-3xl font-extrabold leading-none opacity-25">{initial}</span>
    </div>
  );
}
