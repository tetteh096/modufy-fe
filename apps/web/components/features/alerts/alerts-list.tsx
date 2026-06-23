"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatMoney, formatSaleDate } from "@/lib/format";
import {
  ATTENTION_SEVERITY_META,
  ATTENTION_TYPE_META,
  type AttentionSeverity,
} from "@/lib/attention-constants";
import { cn } from "@/lib/utils";
import type { AttentionItem } from "@/types/api";

type AlertsListProps = {
  items: AttentionItem[];
  currency?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

export function AlertsList({
  items,
  currency = "GHS",
  emptyTitle = "Nothing here",
  emptyDescription = "No alerts in this category right now.",
  className,
}: AlertsListProps) {
  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/15 px-6",
          className
        )}
      >
        <p className="text-sm font-medium">{emptyTitle}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <ul className={cn("divide-y divide-border/60 rounded-xl border border-border/60 overflow-hidden bg-card", className)}>
      {items.map((item) => (
        <AlertRow key={item.id} item={item} currency={currency} />
      ))}
    </ul>
  );
}

export function AlertRow({ item, currency }: { item: AttentionItem; currency: string }) {
  const severity = (item.severity as AttentionSeverity) || "info";
  const severityMeta = ATTENTION_SEVERITY_META[severity] ?? ATTENTION_SEVERITY_META.info;
  const typeMeta = ATTENTION_TYPE_META[item.type] ?? ATTENTION_TYPE_META.default;
  const Icon = typeMeta.icon;

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-start gap-3 px-4 py-4 sm:px-5 transition-colors hover:bg-muted/30 group",
          severityMeta.className
        )}
      >
        <div className="relative mt-0.5 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background",
              severityMeta.dotClass
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{item.body}</p>
              <p className="text-[10px] text-muted-foreground/80 mt-1.5">
                {formatSaleDate(item.at)}
              </p>
            </div>
            {item.amount != null && (
              <p className="text-sm font-semibold tabular-nums shrink-0 text-foreground">
                {formatMoney(item.amount, item.currency ?? currency)}
              </p>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-3 group-hover:text-primary transition-colors" />
      </Link>
    </li>
  );
}
