"use client";

import { useMemo } from "react";
import { Mail } from "lucide-react";
import { wrapNewsletterPreviewHtml } from "@/lib/marketing-email";
import { cn } from "@/lib/utils";

type MarketingEmailPreviewProps = {
  subject?: string;
  bodyHtml: string;
  businessName?: string;
  className?: string;
  /** Compact thumbnail for template cards */
  compact?: boolean;
  /** Hide the fake inbox chrome (subject/from bar) */
  chromeless?: boolean;
};

export function MarketingEmailPreview({
  subject = "Your subject line",
  bodyHtml,
  businessName,
  className,
  compact = false,
  chromeless = false,
}: MarketingEmailPreviewProps) {
  const srcDoc = useMemo(
    () => wrapNewsletterPreviewHtml(bodyHtml, businessName),
    [bodyHtml, businessName],
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-muted/30",
        compact ? "shadow-sm" : "shadow-md",
        className,
      )}
    >
      {!chromeless ? (
        <div className={cn("border-b bg-background", compact ? "px-3 py-2" : "px-4 py-3")}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">From: {businessName || "Your Business"}</span>
          </div>
          <p
            className={cn(
              "mt-1 truncate font-semibold text-foreground",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {subject?.trim() ? (
              subject
            ) : (
              <span className="text-muted-foreground">Add a subject line…</span>
            )}
          </p>
        </div>
      ) : null}

      <div
        className={cn(
          "relative overflow-hidden bg-[#eef2ef]",
          compact ? "h-[140px]" : "min-h-[320px] max-h-[min(520px,55vh)]",
        )}
      >
        <iframe
          title="Email preview"
          srcDoc={srcDoc}
          sandbox=""
          className={cn(
            "w-full border-0 bg-transparent",
            compact ? "pointer-events-none absolute left-0 top-0 origin-top-left scale-[0.42] h-[340px]" : "h-full min-h-[320px]",
            compact ? "w-[238%]" : "",
          )}
        />
      </div>
    </div>
  );
}
