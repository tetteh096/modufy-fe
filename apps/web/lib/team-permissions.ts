import type { TeamPermission, TeamRoleWithPermissions } from "@/types/api";

/** Mirrors services/api role_assignable.go — hide platform-only permissions in UI. */
const BLOCKED_PERMISSION_PREFIXES = ["admin:"];
const BLOCKED_PERMISSION_KEYS = new Set([
  "core:billing:manage",
  "core:modules:manage",
  "core:roles:manage",
]);

export function isAssignablePermission(key: string): boolean {
  if (BLOCKED_PERMISSION_PREFIXES.some((p) => key.startsWith(p))) return false;
  return !BLOCKED_PERMISSION_KEYS.has(key);
}

export function filterAssignablePermissions(permissions: TeamPermission[]): TeamPermission[] {
  return permissions.filter((p) => isAssignablePermission(p.key));
}

const MODULE_ORDER = [
  "core",
  "invoices",
  "inventory",
  "appointments",
  "marketplace",
  "accounts",
  "blog",
  "pos",
] as const;

export function groupPermissionsByModule(permissions: TeamPermission[]) {
  const groups = new Map<string, TeamPermission[]>();
  for (const p of permissions) {
    const list = groups.get(p.module) ?? [];
    list.push(p);
    groups.set(p.module, list);
  }
  return [...groups.entries()].sort(([a], [b]) => {
    const ai = MODULE_ORDER.indexOf(a as (typeof MODULE_ORDER)[number]);
    const bi = MODULE_ORDER.indexOf(b as (typeof MODULE_ORDER)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function formatPermissionLabel(key: string): string {
  const parts = key.split(":");
  if (parts.length !== 3) return key;
  const action = parts[2].replace(/_/g, " ");
  return `${parts[1].replace(/_/g, " ")} · ${action}`;
}

export function formatModuleLabel(module: string): string {
  if (module === "core") return "Core";
  return module.charAt(0).toUpperCase() + module.slice(1);
}

export function formatActivityTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function isModuleEnabled(
  module: string,
  enabledModules: string[] | null | undefined,
): boolean {
  return module === "core" || (enabledModules ?? []).includes(module);
}

export function countEnabledInModule(
  module: string,
  permissions: TeamPermission[],
  selected: Set<string>,
): { on: number; total: number } {
  const modulePerms = permissions.filter((p) => p.module === module);
  const on = modulePerms.filter((p) => selected.has(p.key)).length;
  return { on, total: modulePerms.length };
}

export type RoleSelection =
  | { kind: "system"; name: string }
  | { kind: "custom"; id: string }
  | { kind: "new" };

export function roleSelectionKey(sel: RoleSelection): string {
  if (sel.kind === "system") return `system:${sel.name}`;
  if (sel.kind === "custom") return `custom:${sel.id}`;
  return "new";
}

export function findRole(
  roles: TeamRoleWithPermissions[],
  sel: RoleSelection,
): TeamRoleWithPermissions | undefined {
  if (sel.kind === "system") return roles.find((r) => r.is_system && r.name === sel.name);
  if (sel.kind === "custom") return roles.find((r) => r.id === sel.id);
  return undefined;
}

export function assignableRoles(roles: TeamRoleWithPermissions[]) {
  return roles.filter((r) => r.name !== "owner");
}

export function invitableRoles(roles: TeamRoleWithPermissions[]) {
  return roles.filter((r) => r.name !== "owner" && (r.is_system ? r.name !== "owner" : true));
}
