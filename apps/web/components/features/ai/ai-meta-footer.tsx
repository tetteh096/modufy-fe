import { Badge } from "@/components/ui/badge";
import type { AIMeta } from "@/types/api";

type AiMetaFooterProps = {
  meta: AIMeta | null;
  className?: string;
};

export function AiMetaFooter({ meta, className }: AiMetaFooterProps) {
  if (!meta) return null;
  return (
    <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className ?? ""}`}>
      <span>
        {meta.provider} · {meta.model}
      </span>
      {meta.degraded && <Badge variant="secondary">economy</Badge>}
      <span className="ml-auto tabular-nums">${meta.cost_usd.toFixed(4)}</span>
    </div>
  );
}
