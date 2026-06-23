"use client";

import { Package, Wrench } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

export function InventoryItemPhoto({
  src,
  name,
  type = "product",
  className,
  iconClassName,
}: {
  src?: string | null;
  name?: string;
  type?: "product" | "service" | string;
  className?: string;
  iconClassName?: string;
}) {
  const url = resolveMediaUrl(src);
  const Icon = type === "service" ? Wrench : Package;

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={name ?? ""} className={cn("h-full w-full object-cover", className)} />
    );
  }

  return (
    <div className={cn("flex h-full w-full items-center justify-center bg-muted/40", className)}>
      <Icon className={cn("text-muted-foreground/40", iconClassName ?? "h-8 w-8")} />
    </div>
  );
}
