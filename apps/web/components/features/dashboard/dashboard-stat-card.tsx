"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type DashboardStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  href?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  accent?: "primary" | "destructive" | "secondary" | "muted";
  loading?: boolean;
};

const accentIcon = {
  primary: "bg-primary/12 text-primary",
  destructive: "bg-destructive/10 text-destructive",
  secondary: "bg-secondary text-secondary-foreground",
  muted: "bg-muted text-muted-foreground",
};

const accentBar = {
  primary: "bg-primary",
  destructive: "bg-destructive",
  secondary: "bg-secondary-foreground/40",
  muted: "bg-muted-foreground/40",
};

export function DashboardStatCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
  trend = "neutral",
  accent = "primary",
  loading,
}: DashboardStatCardProps) {
  const body = (
    <Card className="relative h-full overflow-hidden ring-1 ring-inset ring-white/40 dark:ring-white/5">
      <span
        className={cn("absolute inset-x-5 top-0 h-0.5 rounded-b-full opacity-70", accentBar[accent])}
        aria-hidden
      />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              accentIcon[accent]
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>

        {loading ? (
          <Skeleton className="mt-2 h-9 w-28" />
        ) : (
          <p className="mt-2 text-2xl md:text-[1.75rem] font-bold tabular-nums tracking-tight leading-none">
            {value}
          </p>
        )}

        {hint && !loading && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            {trend === "up" && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-0.5 text-primary">
                <TrendingUp className="h-3 w-3" />
              </span>
            )}
            {trend === "down" && (
              <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 p-0.5 text-destructive">
                <TrendingDown className="h-3 w-3" />
              </span>
            )}
            <span className="truncate">{hint}</span>
          </p>
        )}

        {href && (
          <ArrowUpRight
            className="absolute bottom-4 right-4 h-3.5 w-3.5 text-muted-foreground/0 transition-colors duration-200 group-hover:text-muted-foreground/70"
            aria-hidden
          />
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {body}
      </Link>
    );
  }

  return body;
}
