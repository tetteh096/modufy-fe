"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import {
  Building2,
  ChevronRight,
  CreditCard,
  LifeBuoy,
  Package,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { useAdminStore } from "@/store/admin";
import { formatMoney, formatPercentChange } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPlatformCharts } from "@/components/features/admin/admin-platform-charts";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const AVATAR_TINTS = [
  "bg-primary/15 text-primary",
  "bg-secondary/15 text-secondary dark:text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-muted text-foreground",
];

interface KpiProps {
  label: string;
  value: string;
  hint?: string;
  change?: string | null;
  changeUp?: boolean;
  href?: string;
  featured?: boolean;
  accent?: string;
}

function Kpi({ label, value, hint, change, changeUp, href, featured, accent = "bg-primary" }: KpiProps) {
  const inner = (
    <div
      className={cn(
        "relative flex h-full flex-col justify-center px-5 py-4",
        featured && "bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-transparent",
      )}
    >
      <span className={cn("absolute inset-x-0 top-0 h-0.5", accent)} aria-hidden />
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1.5 text-2xl font-semibold tabular-nums tracking-tight", featured && "text-primary")}>
        {value}
      </p>
      {(hint || change) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {change && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
                changeUp === true && "bg-primary/10 text-primary",
                changeUp === false && "bg-destructive/10 text-destructive",
              )}
            >
              {changeUp === true && <TrendingUp className="h-3 w-3" />}
              {changeUp === false && <TrendingDown className="h-3 w-3" />}
              {change}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full transition-colors hover:bg-muted/20">
        {inner}
      </Link>
    );
  }
  return inner;
}

interface MiniStatProps {
  label: string;
  value: string;
  hint: string;
  icon: React.ElementType;
  tint: string;
  iconTint: string;
}

function MiniStat({ label, value, hint, icon: Icon, tint, iconTint }: MiniStatProps) {
  return (
    <div className={cn("rounded-xl border px-5 py-4", tint)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconTint)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-5">
        <Skeleton className="h-72 rounded-xl lg:col-span-3" />
        <Skeleton className="h-72 rounded-xl lg:col-span-2" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export function AdminDashboard() {
  const user = useAdminStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "Admin";

  const [statsQ, businessesQ, auditQ] = useQueries({
    queries: [
      { queryKey: ["admin-dashboard"], queryFn: () => adminApi.dashboard() },
      { queryKey: ["admin-dashboard-businesses"], queryFn: () => adminApi.businesses() },
      { queryKey: ["admin-dashboard-audit"], queryFn: () => adminApi.audit() },
    ],
  });

  if (statsQ.isLoading || !statsQ.data) {
    return <DashboardSkeleton />;
  }

  const raw = statsQ.data;
  const data = {
    ...raw,
    new_signups_30d: raw.new_signups_30d ?? raw.new_signups_7d,
    active_businesses: raw.active_businesses ?? raw.total_businesses - raw.suspended_businesses,
    platform_gmv_30d: raw.platform_gmv_30d ?? 0,
    platform_gmv_7d: raw.platform_gmv_7d ?? 0,
    platform_gmv_prev_7d: raw.platform_gmv_prev_7d ?? 0,
    sales_count_30d: raw.sales_count_30d ?? 0,
    total_customers: raw.total_customers ?? 0,
    platform_mrr: raw.platform_mrr ?? 0,
    gmv_trend: raw.gmv_trend ?? [],
    signups_trend: raw.signups_trend ?? [],
  };
  const recentBusinesses = (businessesQ.data?.businesses ?? []).slice(0, 5);
  const recentAudit = (auditQ.data?.logs ?? []).slice(0, 8);

  const gmvChange = formatPercentChange(data.platform_gmv_7d, data.platform_gmv_prev_7d);
  const moduleAdoption =
    data.total_businesses > 0
      ? Math.round((data.businesses_with_modules / data.total_businesses) * 100)
      : 0;
  const supportQueue = data.open_tickets + data.new_demo_requests;

  return (
    <div className="space-y-6">
      {/* Branded header */}
      <div className="relative overflow-hidden rounded-xl border border-sidebar-border bg-sidebar px-6 py-5 text-sidebar-foreground">
        <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                {greeting()}, {firstName}
              </h1>
              <p className="text-sm text-sidebar-foreground/60">
                Platform overview ·{" "}
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              render={<Link href="/businesses" />}
            >
              Businesses
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-sidebar-foreground/20 bg-sidebar-foreground/5 text-sidebar-foreground hover:bg-sidebar-foreground/10"
              render={<Link href="/tickets" />}
            >
              Support
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-sidebar-foreground/20 bg-sidebar-foreground/5 text-sidebar-foreground hover:bg-sidebar-foreground/10"
              render={<Link href="/demos" />}
            >
              Demos
            </Button>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
          <Kpi
            label="Platform GMV"
            value={formatMoney(data.platform_gmv_30d)}
            hint="30-day merchant sales"
            featured
            accent="bg-primary"
          />
          <Kpi
            label="GMV this week"
            value={formatMoney(data.platform_gmv_7d)}
            change={gmvChange ?? undefined}
            changeUp={gmvChange ? data.platform_gmv_7d >= data.platform_gmv_prev_7d : undefined}
            hint="vs previous 7 days"
            accent="bg-primary/60"
          />
          <Kpi
            label="New signups"
            value={String(data.new_signups_7d)}
            hint={`${data.new_signups_30d} in last 30 days`}
            href="/businesses"
            accent="bg-secondary/60"
          />
          <Kpi
            label="Active tenants"
            value={String(data.active_businesses)}
            hint={`${data.suspended_businesses} suspended`}
            href="/businesses"
            accent="bg-accent-foreground/30"
          />
          <Kpi
            label="Support queue"
            value={String(supportQueue)}
            hint={`${data.open_tickets} tickets · ${data.new_demo_requests} demos`}
            href="/tickets"
            accent={supportQueue > 0 ? "bg-amber-500/70" : "bg-muted-foreground/30"}
          />
        </div>
      </div>

      <AdminPlatformCharts
        gmvTrend={data.gmv_trend ?? []}
        signupsTrend={data.signups_trend ?? []}
      />

      {/* Secondary metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          label="Subscription MRR"
          value={data.platform_mrr > 0 ? formatMoney(data.platform_mrr) : "—"}
          hint="Billing integration coming soon"
          icon={CreditCard}
          tint="border-violet-500/20 bg-violet-500/[0.04]"
          iconTint="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        />
        <MiniStat
          label="Sales transactions"
          value={String(data.sales_count_30d)}
          hint="Completed sales · 30 days"
          icon={Package}
          tint="border-primary/20 bg-primary/[0.04]"
          iconTint="bg-primary/10 text-primary"
        />
        <MiniStat
          label="End customers"
          value={String(data.total_customers)}
          hint="Across all businesses"
          icon={Users}
          tint="border-sky-500/20 bg-sky-500/[0.04]"
          iconTint="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
        <MiniStat
          label="Module adoption"
          value={`${moduleAdoption}%`}
          hint={`${data.businesses_with_modules} of ${data.total_businesses} on paid modules`}
          icon={Building2}
          tint="border-emerald-500/20 bg-emerald-500/[0.04]"
          iconTint="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Building2 className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">Recent businesses</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" render={<Link href="/businesses" />}>
              View all
              <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
            </Button>
          </div>
          {businessesQ.isLoading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentBusinesses.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No businesses yet.</p>
          ) : (
            <div className="divide-y">
              {recentBusinesses.map((biz, i) => (
                <Link
                  key={biz.id}
                  href={`/businesses/${biz.id}`}
                  className="flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-primary/[0.03]"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      AVATAR_TINTS[i % AVATAR_TINTS.length],
                    )}
                  >
                    {biz.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{biz.name}</span>
                      {biz.suspended && (
                        <Badge variant="destructive" className="text-[10px]">
                          Suspended
                        </Badge>
                      )}
                      {biz.verified && !biz.suspended && (
                        <Badge className="bg-primary/10 text-primary text-[10px] hover:bg-primary/10">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {biz.category} · {biz.modules_enabled.length} modules
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(biz.created_at)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/15">
                <LifeBuoy className="h-3.5 w-3.5 text-secondary dark:text-secondary-foreground" />
              </div>
              <h3 className="text-sm font-semibold">Recent admin activity</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" render={<Link href="/audit" />}>
              Audit log
              <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
            </Button>
          </div>
          {auditQ.isLoading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentAudit.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No admin actions recorded yet.</p>
          ) : (
            <div className="divide-y">
              {recentAudit.map((log) => (
                <div key={log.id} className="flex items-start justify-between gap-3 px-5 py-3 text-sm">
                  <div className="min-w-0">
                    <Badge variant="outline" className="font-mono text-[10px] bg-muted/50">
                      {log.action}
                    </Badge>
                    <p className="mt-1.5 truncate text-xs text-muted-foreground">
                      {log.actor_name}
                      {log.target_type && ` · ${log.target_type}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(log.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
