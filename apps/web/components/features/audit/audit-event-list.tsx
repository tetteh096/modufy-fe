"use client";

import {
  Activity,
  Clock,
  FileText,
  KeyRound,
  Receipt,
  Shield,
  ShoppingCart,
  UserPlus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AuditEvent } from "@/types/api";
import { formatActivityTime } from "@/lib/team-permissions";
import { EmptyState } from "@/components/shared/empty-state";

function auditIcon(action: string): LucideIcon {
  if (action.startsWith("auth.")) return Clock;
  if (action.startsWith("team.")) {
    if (action.includes("password")) return KeyRound;
    if (action.includes("permission") || action.includes("role")) return Shield;
    return Users;
  }
  if (action.startsWith("customer.")) return UserPlus;
  if (action.startsWith("sale.")) return ShoppingCart;
  if (action.startsWith("expense.")) return Receipt;
  if (action.startsWith("invoice.")) return FileText;
  return Activity;
}

type AuditEventListProps = {
  events: AuditEvent[];
  emptyTitle?: string;
  emptyDescription?: string;
  showActor?: boolean;
};

export function AuditEventList({
  events,
  emptyTitle = "No activity yet",
  emptyDescription = "Actions across your business will appear here as they happen.",
  showActor = true,
}: AuditEventListProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Activity className="h-8 w-8" />}
      />
    );
  }

  return (
    <ol className="relative ml-3 space-y-0 border-l border-border/60 pl-6">
      {events.map((item) => {
        const Icon = auditIcon(item.action);
        return (
          <li key={item.id} className="relative pb-6 last:pb-0">
            <span className="absolute -left-[1.85rem] flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm font-medium leading-tight">{item.description}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span>{formatActivityTime(item.created_at)}</span>
              {showActor && item.actor_name ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{item.actor_name}</span>
                </>
              ) : null}
              {item.resource_label ? (
                <>
                  <span aria-hidden>·</span>
                  <span className="truncate max-w-[16rem]">{item.resource_label}</span>
                </>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
