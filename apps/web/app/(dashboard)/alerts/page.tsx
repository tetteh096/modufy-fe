"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2, Settings2 } from "lucide-react";
import { businessApi } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { ALERT_TABS, type AlertTabKey } from "@/lib/attention-constants";
import { PageHeader } from "@/components/shared/page-header";
import { AlertsList } from "@/components/features/alerts/alerts-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AttentionItem } from "@/types/api";

function parseTab(raw: string | null): AlertTabKey {
  if (raw && ALERT_TABS.some((t) => t.key === raw)) {
    return raw as AlertTabKey;
  }
  return "all";
}

function filterItems(items: AttentionItem[], tab: AlertTabKey): AttentionItem[] {
  if (tab === "all") return items;
  if (tab === "due_soon") return items.filter((i) => i.type === "invoice_due_soon");
  return items.filter((i) => i.category === tab);
}

function tabBadgeCount(items: AttentionItem[], tab: AlertTabKey): number {
  return filterItems(items, tab).length;
}

export default function AlertsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));
  const { currency } = useDefaultCurrency();

  const { data, isLoading } = useQuery({
    queryKey: ["attention"],
    queryFn: () => businessApi.attention.list(),
    refetchInterval: 120_000,
  });

  const allItems = data?.items ?? [];
  const visibleItems = useMemo(() => filterItems(allItems, activeTab), [allItems, activeTab]);

  const summary = useMemo(() => {
    const s = { critical: 0, warning: 0, info: 0 };
    for (const item of visibleItems) {
      if (item.severity === "critical") s.critical++;
      else if (item.severity === "warning") s.warning++;
      else s.info++;
    }
    return s;
  }, [visibleItems]);

  const tabMeta = useMemo(
    () => ALERT_TABS.find((t) => t.key === activeTab) ?? ALERT_TABS[0],
    [activeTab]
  );

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.replace(qs ? `/alerts?${qs}` : "/alerts", { scroll: false });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        description="One place for invoices due, low stock, appointments, and tax — tap any item to act on it."
        action={
          <Button variant="outline" size="sm" className="gap-1.5 h-8" nativeButton={false} render={<Link href="/settings/alerts" />}>
            <Settings2 className="h-4 w-4" />
            Alert rules
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-2xl rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <>
          {allItems.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] px-5 py-4 text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <span className="text-muted-foreground">
                All caught up — nothing needs your attention right now. Alerts appear here when
                invoices are due, stock runs low, bookings need confirming, or tax is due.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {summary.critical > 0 && (
                <span className="text-xs font-medium rounded-full px-2.5 py-1 bg-destructive/10 text-destructive border border-destructive/20">
                  {summary.critical} urgent
                </span>
              )}
              {summary.warning > 0 && (
                <span className="text-xs font-medium rounded-full px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  {summary.warning} action needed
                </span>
              )}
              {activeTab === "all" && (
                <span className="text-xs text-muted-foreground self-center">
                  {allItems.length} total across all categories
                </span>
              )}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setTab} className="space-y-4">
            <TabsList className="h-auto flex-wrap justify-start gap-1 bg-muted/40 p-1 w-full max-w-full">
              {ALERT_TABS.map((tab) => {
                const count = tabBadgeCount(allItems, tab.key);
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className="gap-1.5 data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={cn(
                          "ml-0.5 min-w-[1.25rem] rounded-full px-1.5 py-0 text-[10px] font-semibold tabular-nums",
                          activeTab === tab.key
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {ALERT_TABS.map((tab) => (
              <TabsContent key={tab.key} value={tab.key} className="mt-0 space-y-4">
                <div className="rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    {tab.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{tab.description}</p>
                </div>

                {activeTab === tab.key && (
                  <AlertsList
                    items={visibleItems}
                    currency={currency}
                    emptyTitle={`No ${tab.label.toLowerCase()} alerts`}
                    emptyDescription={tab.description}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>

          {activeTab !== "all" && visibleItems.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing {visibleItems.length} {tabMeta.label.toLowerCase()} alert
              {visibleItems.length !== 1 ? "s" : ""}.{" "}
              <button
                type="button"
                onClick={() => setTab("all")}
                className="text-primary font-medium hover:underline"
              >
                View all alerts
              </button>
            </p>
          )}
        </>
      )}
    </div>
  );
}
