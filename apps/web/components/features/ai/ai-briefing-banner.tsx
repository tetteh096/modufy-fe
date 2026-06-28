"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, X } from "lucide-react";
import { aiApi } from "@/lib/api";
import { useAiModule } from "@/hooks/use-ai-module";
import { AiMetaFooter } from "@/components/features/ai/ai-meta-footer";
import { Button } from "@/components/ui/button";
import { glassAccent } from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function AiBriefingBanner() {
  const { isAiEnabled } = useAiModule();
  const [dismissed, setDismissed] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ai", "briefing"],
    queryFn: () => aiApi.briefing(),
    enabled: isAiEnabled && !dismissed,
    staleTime: 30 * 60_000,
    retry: false,
  });

  if (!isAiEnabled || dismissed) return null;

  if (isLoading) {
    return <Skeleton className="h-16 w-full rounded-xl" />;
  }

  if (isError || !data?.text) return null;

  return (
    <div className={cn(glassAccent, "px-4 py-3")}>
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm leading-relaxed">{data.text}</p>
          <AiMetaFooter meta={data.meta} />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground"
          onClick={() => setDismissed(true)}
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Dismiss briefing</span>
        </Button>
      </div>
    </div>
  );
}
