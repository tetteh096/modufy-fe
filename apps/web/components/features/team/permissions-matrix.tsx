"use client";

import Link from "next/link";
import {
  Calculator,
  Package,
  Receipt,
  Sparkles,
  Store,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { formatModuleLabel, formatPermissionLabel } from "@/lib/team-permissions";
import { TEAM_ROLE_META } from "@/lib/team-roles";
import type { TeamPermission, TeamRoleWithPermissions } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const MODULE_ICONS: Record<string, LucideIcon> = {
  core: UserCog,
  invoices: Receipt,
  inventory: Package,
  appointments: Users,
  marketplace: Store,
  accounts: Calculator,
  blog: Sparkles,
};

const SYSTEM_ROLE_ACCENT: Record<string, string> = {
  manager: "border-l-sky-500",
  staff: "border-l-emerald-500",
  accountant: "border-l-amber-500",
};

export function roleCardTitle(role: TeamRoleWithPermissions): string {
  if (role.is_system) {
    return TEAM_ROLE_META[role.name as keyof typeof TEAM_ROLE_META]?.label ?? role.display_name;
  }
  return role.display_name;
}

export function roleCardDescription(role: TeamRoleWithPermissions): string {
  if (role.is_system) {
    return TEAM_ROLE_META[role.name as keyof typeof TEAM_ROLE_META]?.description ?? role.description;
  }
  return role.description;
}

interface PermissionsMatrixProps {
  permissions: TeamPermission[];
  enabledModules: string[];
  selected: Set<string>;
  search: string;
  canEdit: boolean;
  showDisabledModules: boolean;
  onTogglePermission: (key: string, checked: boolean) => void;
  onToggleModule: (keys: string[], enable: boolean) => void;
}

export function PermissionsMatrix({
  permissions,
  enabledModules,
  selected,
  search,
  canEdit,
  showDisabledModules,
  onTogglePermission,
  onToggleModule,
}: PermissionsMatrixProps) {
  const q = search.trim().toLowerCase();

  const byModule = permissions.reduce<Map<string, TeamPermission[]>>((acc, p) => {
    const list = acc.get(p.module) ?? [];
    list.push(p);
    acc.set(p.module, list);
    return acc;
  }, new Map());

  const modules = [...byModule.keys()].sort((a, b) => {
    const order = ["core", "invoices", "inventory", "appointments", "marketplace", "accounts", "blog", "pos"];
    return (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b));
  });

  const activeModules = modules.filter((m) => m === "core" || enabledModules.includes(m));
  const inactiveModules = modules.filter((m) => m !== "core" && !enabledModules.includes(m));

  function renderModule(module: string, muted = false) {
    const perms = byModule.get(module) ?? [];
    const filtered = q
      ? perms.filter(
          (p) =>
            p.key.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            formatPermissionLabel(p.key).toLowerCase().includes(q),
        )
      : perms;
    if (filtered.length === 0) return null;

    const enabled = module === "core" || enabledModules.includes(module);
    const keys = filtered.map((p) => p.key);
    const onCount = filtered.filter((p) => selected.has(p.key)).length;
    const allOn = keys.length > 0 && keys.every((k) => selected.has(k));
    const Icon = MODULE_ICONS[module] ?? Sparkles;
    const editable = canEdit && enabled && !muted;

    return (
      <section
        key={module}
        className={cn(
          "rounded-xl border bg-card overflow-hidden",
          muted ? "border-dashed border-border/50 opacity-80" : "border-border/70 shadow-sm",
        )}
      >
        <div className="flex items-center gap-4 px-5 py-4 lg:px-6 border-b border-border/40 bg-muted/20">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              enabled && !muted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold">{formatModuleLabel(module)}</h4>
              <Badge variant="secondary" className="text-[10px] font-normal tabular-nums">
                {onCount}/{filtered.length}
              </Badge>
              {(!enabled || muted) && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  Not enabled
                </Badge>
              )}
            </div>
            {enabled && !muted && onCount > 0 && (
              <div className="mt-1.5 h-1 w-full max-w-[140px] rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(onCount / filtered.length) * 100}%` }}
                />
              </div>
            )}
          </div>
          {editable && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs shrink-0"
              onClick={() => onToggleModule(keys, !allOn)}
            >
              {allOn ? "Clear all" : "Select all"}
            </Button>
          )}
        </div>

        <div className="grid gap-3 p-4 lg:p-5 sm:grid-cols-2">
          {filtered.map((perm) => {
            const checked = selected.has(perm.key);
            return (
              <label
                key={perm.key}
                className={cn(
                  "flex items-start gap-3 rounded-lg border border-transparent px-3 py-3 transition-colors",
                  editable
                    ? "cursor-pointer hover:border-border/60 hover:bg-muted/20"
                    : "cursor-not-allowed opacity-55",
                )}
              >
                <Checkbox
                  checked={checked}
                  disabled={!editable}
                  onCheckedChange={(v) => onTogglePermission(perm.key, v === true)}
                  className="mt-0.5"
                />
                <span className="text-sm leading-relaxed">
                  {perm.description || formatPermissionLabel(perm.key)}
                </span>
              </label>
            );
          })}
        </div>
      </section>
    );
  }

  const activeContent = activeModules.map((m) => renderModule(m)).filter(Boolean);
  const inactiveContent = showDisabledModules
    ? inactiveModules.map((m) => renderModule(m, true)).filter(Boolean)
    : [];

  if (activeContent.length === 0 && inactiveContent.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        No permissions match your search.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {activeContent}

      {inactiveModules.length > 0 && !showDisabledModules && (
        <div className="rounded-xl border border-dashed bg-muted/15 px-4 py-4 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">{inactiveModules.length} modules</strong> are off
            for your business — their permissions are hidden.
          </p>
          <p className="text-xs mt-1">
            Turn them on in{" "}
            <Link href="/settings/modules" className="text-primary font-medium hover:underline">
              Settings → Modules
            </Link>{" "}
            to assign related access.
          </p>
        </div>
      )}

      {inactiveContent.length > 0 && (
        <details className="rounded-xl border border-dashed border-border/50 bg-muted/10">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
            Show permissions for disabled modules ({inactiveModules.length})
          </summary>
          <div className="px-4 pb-4 space-y-4">{inactiveContent}</div>
        </details>
      )}
    </div>
  );
}

export { SYSTEM_ROLE_ACCENT, MODULE_ICONS };
