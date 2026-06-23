"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api";
import { TEAM_ROLE_META } from "@/lib/team-roles";
import { cn } from "@/lib/utils";
import type { TeamRoleWithPermissions } from "@/types/api";

export type SelectedAssignRole =
  | { type: "system"; name: string }
  | { type: "custom"; id: string; name: string; display_name: string };

interface TeamRolePickerProps {
  value: SelectedAssignRole;
  onChange: (role: SelectedAssignRole) => void;
  className?: string;
  /** Hide descriptions on unselected roles — use on member detail page */
  compact?: boolean;
}

function toSelected(role: TeamRoleWithPermissions): SelectedAssignRole {
  if (role.is_system) return { type: "system", name: role.name };
  return {
    type: "custom",
    id: role.id,
    name: role.name,
    display_name: role.display_name,
  };
}

export function TeamRolePicker({ value, onChange, className, compact }: TeamRolePickerProps) {
  const { data } = useQuery({
    queryKey: ["team-roles"],
    queryFn: businessApi.team.listRoles,
  });

  const assignable =
    data?.roles.filter((r) => r.name !== "owner") ?? [];

  const systemRoles = assignable.filter((r) => r.is_system);
  const customRoles = assignable.filter((r) => !r.is_system);

  function isActive(role: TeamRoleWithPermissions) {
    if (value.type === "system" && role.is_system) return value.name === role.name;
    if (value.type === "custom" && !role.is_system) return value.id === role.id;
    return false;
  }

  function renderRoleButton(role: TeamRoleWithPermissions) {
    const active = isActive(role);
    const meta = TEAM_ROLE_META[role.name as keyof typeof TEAM_ROLE_META];
    const description = meta?.description ?? role.description;
    return (
      <button
        key={role.id}
        type="button"
        onClick={() => onChange(toSelected(role))}
        className={cn(
          "w-full rounded-lg border p-3 text-left transition-colors",
          active ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50",
        )}
      >
        <p className="text-sm font-medium">{role.display_name}</p>
        {(!compact || active) && description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </button>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">{systemRoles.map(renderRoleButton)}</div>
      {customRoles.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Custom roles
          </p>
          {customRoles.map(renderRoleButton)}
        </div>
      )}
    </div>
  );
}

export function selectedRolePayload(value: SelectedAssignRole) {
  if (value.type === "custom") return { role_id: value.id };
  return { role: value.name };
}
