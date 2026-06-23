"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { businessApi } from "@/lib/api";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { cn } from "@/lib/utils";

export function AlertsSidebarNavItem() {
  const { data } = useQuery({
    queryKey: ["attention"],
    queryFn: () => businessApi.attention.list(),
    refetchInterval: 120_000,
  });

  const count = data?.items?.length ?? 0;
  const urgent = data?.summary?.critical ?? 0;

  return (
    <SidebarNavItem
      href="/alerts"
      icon={Bell}
      label="Alerts"
      badge={
        count > 0 ? (
          <span
            className={cn(
              "ml-auto group-data-[collapsible=icon]:hidden min-w-[1.125rem] rounded-full px-1.5 py-0 text-[10px] font-semibold tabular-nums leading-5",
              urgent > 0
                ? "bg-destructive text-destructive-foreground"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
            )}
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : undefined
      }
    />
  );
}
