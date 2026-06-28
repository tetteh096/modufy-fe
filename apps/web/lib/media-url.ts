/** Public base URL for object storage (MinIO locally, R2/CDN in prod). */
const STORAGE_BASE =
  process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://localhost:9000/bizos-uploads";

/** Resolve a storage object key to a browser URL (fallback when API returns raw keys). */
export function resolveMediaUrl(src?: string | null): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const base = STORAGE_BASE.replace(/\/$/, "");
  return `${base}/${src.replace(/^\//, "")}`;
}
