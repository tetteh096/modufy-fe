"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCircle2,
  Layers,
  Package,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import {
  ADMIN_MODULE_CATEGORIES,
  ADMIN_MODULES,
  type AdminModuleDef,
} from "@/lib/admin-modules";
import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Filter = "all" | "active" | "inactive";

function ModuleCard({
  mod,
  enabled,
  enabledAt,
  pendingKey,
  onToggle,
}: {
  mod: AdminModuleDef;
  enabled: boolean;
  enabledAt?: string;
  pendingKey: string | null;
  onToggle: () => void;
}) {
  const Icon = mod.icon;
  const isPending = pendingKey === mod.key;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border p-4 transition-shadow",
        mod.tint,
        enabled ? "shadow-sm" : "opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", mod.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
        <Badge
          variant={enabled ? "default" : "outline"}
          className={cn(
            "shrink-0 text-[10px]",
            enabled && "bg-primary/90 hover:bg-primary/90",
          )}
        >
          {enabled ? "Active" : "Off"}
        </Badge>
      </div>

      <div className="mt-3 min-w-0 flex-1">
        <h3 className="font-semibold text-sm">{mod.label}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{mod.description}</p>
        {enabled && enabledAt && (
          <p className="mt-2 text-[10px] text-muted-foreground/80">
            Enabled {new Date(enabledAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <Button
        size="sm"
        variant={enabled ? "outline" : "default"}
        className={cn(
          "mt-4 w-full gap-1.5",
          !enabled && "bg-primary hover:bg-primary/90",
        )}
        disabled={isPending}
        onClick={onToggle}
      >
        {isPending ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        ) : enabled ? (
          <>
            <XCircle className="h-3.5 w-3.5" />
            Disable module
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Enable module
          </>
        )}
      </Button>
    </div>
  );
}

export function BusinessModulesPanel() {
  const { businessId, business } = useBusinessWorkspace();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const toggleModule = useMutation({
    mutationFn: ({ module, enabled }: { module: string; enabled: boolean }) =>
      adminApi.toggleModule(businessId, module, enabled),
    onMutate: ({ module }) => setPendingKey(module),
    onSuccess: (_, { enabled, module }) => {
      const label = getAdminModuleLabel(module);
      toast.success(`${label} ${enabled ? "enabled" : "disabled"}`);
      qc.invalidateQueries({ queryKey: ["admin-business", businessId] });
      qc.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
    onSettled: () => setPendingKey(null),
  });

  const moduleMap = useMemo(
    () => new Map(business?.modules.map((m) => [m.module, m]) ?? []),
    [business?.modules],
  );

  if (!business) return null;

  const enabledCount = ADMIN_MODULES.filter((m) => moduleMap.get(m.key)?.enabled).length;
  const adoptionPct = Math.round((enabledCount / ADMIN_MODULES.length) * 100);

  const filteredModules = ADMIN_MODULES.filter((mod) => {
    const enabled = moduleMap.get(mod.key)?.enabled ?? false;
    if (filter === "active") return enabled;
    if (filter === "inactive") return !enabled;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active modules</p>
              <p className="text-xl font-semibold tabular-nums">
                {enabledCount}
                <span className="text-sm font-normal text-muted-foreground"> / {ADMIN_MODULES.length}</span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Module adoption</p>
              <p className="text-xl font-semibold tabular-nums">{adoptionPct}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Core platform</p>
              <p className="text-sm font-medium">Always included</p>
              <p className="text-[10px] text-muted-foreground">Sales, customers, dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adoption bar */}
      <div className="rounded-xl border bg-card px-4 py-3">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-muted-foreground">Paid module coverage</span>
          <span className="font-medium tabular-nums">{adoptionPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${adoptionPct}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: "All modules" },
            { key: "active", label: "Active" },
            { key: "inactive", label: "Inactive" },
          ] as const
        ).map(({ key, label }) => (
          <Button
            key={key}
            size="sm"
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Grouped modules */}
      {ADMIN_MODULE_CATEGORIES.map((category) => {
        const categoryModules = filteredModules.filter((m) => m.category === category.id);
        if (categoryModules.length === 0) return null;

        return (
          <section key={category.id}>
            <div className="mb-3">
              <h2 className="text-sm font-semibold">{category.label}</h2>
              <p className="text-xs text-muted-foreground">{category.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categoryModules.map((mod) => {
                const item = moduleMap.get(mod.key);
                return (
                  <ModuleCard
                    key={mod.key}
                    mod={mod}
                    enabled={item?.enabled ?? false}
                    enabledAt={item?.enabled_at}
                    pendingKey={pendingKey}
                    onToggle={() =>
                      toggleModule.mutate({ module: mod.key, enabled: !(item?.enabled ?? false) })
                    }
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {filteredModules.length === 0 && (
        <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
          No {filter === "active" ? "active" : "inactive"} modules in this view.
        </div>
      )}
    </div>
  );
}

function getAdminModuleLabel(key: string) {
  return ADMIN_MODULES.find((m) => m.key === key)?.label ?? key;
}
