import type { PublicService } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";

export function serviceGalleryImages(service: PublicService): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of [service.photo_url, ...(service.images ?? [])]) {
    if (!raw) continue;
    const url = resolveMediaUrl(raw);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }

  return out;
}

export function serviceCoverImage(service: PublicService): string | null {
  return serviceGalleryImages(service)[0] ?? null;
}
