"use client";

import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type DashboardMetricTileProps = {
  title: string;
  value: string;
  hint?: string;
  href: string;
  icon: LucideIcon;
  accent?: "primary" | "orange" | "blue" | "muted";
  loading?: boolean;
};

const accentStyles = {
  primary:
    "bg-primary/12 text-primary boron:border-2 boron:border-black boron:rounded-[5px] boron:bg-secondary boron:shadow-[2px_2px_0_0_#000000]",
  orange:
    "bg-orange-500/12 text-orange-600 dark:text-orange-400 boron:border-2 boron:border-black boron:rounded-[5px] boron:bg-secondary boron:text-destructive boron:shadow-[2px_2px_0_0_#000000]",
  blue:
    "bg-blue-500/12 text-blue-600 dark:text-blue-400 boron:border-2 boron:border-black boron:rounded-[5px] boron:bg-accent/30 boron:text-accent-foreground boron:shadow-[2px_2px_0_0_#000000]",
  muted:
    "bg-muted text-muted-foreground boron:border-2 boron:border-black boron:rounded-[5px] boron:bg-secondary boron:shadow-[2px_2px_0_0_#000000]",
};

export function DashboardMetricTile({
  title,
  value,
  hint,
  href,
  icon: Icon,
  accent = "primary",
  loading,
}: DashboardMetricTileProps) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-colors hover:border-border/80 boron:hover:translate-x-px boron:hover:translate-y-px boron:active:translate-x-0 boron:active:translate-y-0">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className={cn("rounded-lg p-2 shrink-0", accentStyles[accent])}>
              <Icon className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
          </div>
          <p className="text-xs text-muted-foreground mt-3">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-20 mt-1" />
          ) : (
            <p className="text-lg font-semibold tracking-tight mt-0.5 tabular-nums">{value}</p>
          )}
          {hint && !loading && (
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{hint}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
