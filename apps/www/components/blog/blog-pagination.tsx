import Link from "next/link";
import { cn } from "@/lib/utils";

export function BlogPagination() {
  return (
    <nav aria-label="Blog pagination" className="mt-8 flex items-center gap-2">
      <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">
        1
      </span>
      <Link
        href="/blog"
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
      >
        2
      </Link>
      <Link
        href="/blog"
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
        )}
      >
        next
      </Link>
    </nav>
  );
}
