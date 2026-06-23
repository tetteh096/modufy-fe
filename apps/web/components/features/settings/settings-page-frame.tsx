"use client";

import { usePathname } from "next/navigation";
import { getSettingsNavMeta } from "@/lib/settings-nav";
import { BackToAppLink } from "@/components/layout/back-to-app-link";
import { cn } from "@/lib/utils";

/** Wraps every settings page: back link, breadcrumb, full-width content area. */
export function SettingsPageFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const meta = getSettingsNavMeta(pathname);

  return (
    <div className={cn("w-full space-y-8 pb-10", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <BackToAppLink />
          <nav aria-label="Settings breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-muted-foreground">Settings</span>
            {meta && (
              <>
                <span className="text-muted-foreground/60">/</span>
                <span className="font-medium text-foreground truncate">{meta.label}</span>
              </>
            )}
          </nav>
        </div>
        {meta?.description && (
          <p className="text-sm text-muted-foreground sm:max-w-md sm:text-right">
            {meta.description}
          </p>
        )}
      </div>

      <div className="w-full space-y-8">{children}</div>
    </div>
  );
}
