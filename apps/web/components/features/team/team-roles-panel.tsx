"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RotateCcw, Search, Shield, Sparkles, Trash2, Users } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import {
  filterAssignablePermissions,
  findRole,
  type RoleSelection,
} from "@/lib/team-permissions";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import {
  PermissionsMatrix,
  roleCardDescription,
  roleCardTitle,
  SYSTEM_ROLE_ACCENT,
} from "@/components/features/team/permissions-matrix";
import { SectionLoader } from "@/components/shared/page-loader";
import { Spinner } from "@/components/shared/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function TeamRolesPanel() {
  const queryClient = useQueryClient();
  const [selection, setSelection] = useState<RoleSelection>({ kind: "system", name: "manager" });
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["team-roles"],
    queryFn: businessApi.team.listRoles,
  });

  const { data: modulesData } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
    staleTime: 60_000,
  });

  const enabledModules = useMemo(
    () => (modulesData?.modules ?? []).filter((m) => m.enabled).map((m) => m.module),
    [modulesData?.modules],
  );

  const assignablePermissions = useMemo(
    () => filterAssignablePermissions(data?.permissions ?? []),
    [data?.permissions],
  );

  const roleData = useMemo(
    () => (selection.kind !== "new" && data ? findRole(data.roles, selection) : undefined),
    [data, selection],
  );

  const systemRoles = useMemo(
    () => data?.roles.filter((r) => r.is_system && r.name !== "owner") ?? [],
    [data?.roles],
  );
  const customRoles = useMemo(() => data?.roles.filter((r) => !r.is_system) ?? [], [data?.roles]);

  useEffect(() => {
    if (selection.kind === "new") {
      setDraft(new Set());
      setDraftName("");
      setDraftDescription("");
      setDirty(false);
      return;
    }
    if (roleData) {
      setDraft(new Set(roleData.permissions));
      setDraftName(roleCardTitle(roleData));
      setDraftDescription(roleData.description);
      setDirty(false);
    }
  }, [roleData, selection]);

  const saveSystemMutation = useMutation({
    mutationFn: (name: string) =>
      businessApi.team.updateRolePermissions(name, [...draft].sort()),
    onSuccess: () => {
      toast.success("Role permissions saved");
      setDirty(false);
      queryClient.invalidateQueries({ queryKey: ["team-roles"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const resetSystemMutation = useMutation({
    mutationFn: (name: string) => businessApi.team.resetRolePermissions(name),
    onSuccess: () => {
      toast.success("Restored BizOS defaults");
      queryClient.invalidateQueries({ queryKey: ["team-roles"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      businessApi.team.createCustomRole({
        name: draftName.trim(),
        description: draftDescription.trim() || draftName.trim(),
        permissions: [...draft].sort(),
      }),
    onSuccess: (created) => {
      toast.success("Custom role created");
      setSelection({ kind: "custom", id: created.id });
      setDirty(false);
      queryClient.invalidateQueries({ queryKey: ["team-roles"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateCustomMutation = useMutation({
    mutationFn: (id: string) =>
      businessApi.team.updateCustomRole(id, {
        name: draftName.trim(),
        description: draftDescription.trim(),
        permissions: [...draft].sort(),
      }),
    onSuccess: () => {
      toast.success("Custom role updated");
      setDirty(false);
      queryClient.invalidateQueries({ queryKey: ["team-roles"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => businessApi.team.deleteCustomRole(id),
    onSuccess: () => {
      toast.success("Custom role deleted");
      setSelection({ kind: "system", name: "manager" });
      queryClient.invalidateQueries({ queryKey: ["team-roles"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function togglePermission(key: string, checked: boolean) {
    setDraft((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
    setDirty(true);
  }

  function toggleModule(keys: string[], enable: boolean) {
    setDraft((prev) => {
      const next = new Set(prev);
      for (const key of keys) {
        if (enable) next.add(key);
        else next.delete(key);
      }
      return next;
    });
    setDirty(true);
  }

  if (isLoading || !data) return <SectionLoader />;

  const isNew = selection.kind === "new";
  const isCustom = selection.kind === "custom";
  const isSystem = selection.kind === "system";
  const canEdit = isNew || (roleData?.editable ?? false);
  const selectedCount = draft.size;
  const totalCount = assignablePermissions.length;
  const editorTitle = isNew
    ? "New custom role"
    : roleData
      ? roleCardTitle(roleData)
      : "Select a role";

  function handleSave() {
    if (isNew) {
      if (!draftName.trim()) {
        toast.error("Enter a role name");
        return;
      }
      createMutation.mutate();
      return;
    }
    if (isSystem && selection.kind === "system") {
      saveSystemMutation.mutate(selection.name);
      return;
    }
    if (isCustom && selection.kind === "custom") {
      updateCustomMutation.mutate(selection.id);
    }
  }

  const saving =
    saveSystemMutation.isPending ||
    createMutation.isPending ||
    updateCustomMutation.isPending;

  return (
    <div className="rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border/50 bg-muted/20 px-6 py-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Shield className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Roles & permissions</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
              Pick a template or build a custom role. Permissions only apply to modules your
              business has turned on.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:grid xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] xl:min-h-[640px]">
        <aside className="border-b xl:border-b-0 xl:border-r border-border/50 p-5 lg:p-6 space-y-8 bg-muted/5 shrink-0">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 px-1">
              Templates
            </p>
            <div className="space-y-3">
              {systemRoles.map((role) => {
                const active = selection.kind === "system" && selection.name === role.name;
                const accent = SYSTEM_ROLE_ACCENT[role.name] ?? "border-l-primary";
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelection({ kind: "system", name: role.name })}
                    className={cn(
                      "w-full rounded-xl border border-l-[3px] px-4 py-4 text-left transition-all",
                      accent,
                      active
                        ? "border-primary/30 bg-primary/5 shadow-sm ring-1 ring-primary/10"
                        : "border-border/60 bg-background hover:border-border hover:shadow-sm",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{roleCardTitle(role)}</span>
                      {role.uses_override && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                          Edited
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {roleCardDescription(role)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 tabular-nums">
                      <Users className="h-3 w-3" />
                      {role.member_count} members · {role.permissions.length} permissions
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Custom roles
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => setSelection({ kind: "new" })}
              >
                <Plus className="h-3 w-3" />
                New
              </Button>
            </div>
            {customRoles.length === 0 ? (
              <button
                type="button"
                onClick={() => setSelection({ kind: "new" })}
                className={cn(
                  "w-full rounded-xl border border-dashed px-4 py-5 text-left transition-colors",
                  selection.kind === "new"
                    ? "border-primary/40 bg-primary/5 ring-1 ring-primary/10"
                    : "border-border/60 hover:border-primary/30 hover:bg-primary/5",
                )}
              >
                <Sparkles className="h-4 w-4 mb-2 text-primary/80" />
                <p className="text-sm font-medium">Create a custom role</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  e.g. Cashier, Receptionist, Stockroom
                </p>
              </button>
            ) : (
              <div className="space-y-2">
                {customRoles.map((role) => {
                  const active = selection.kind === "custom" && selection.id === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelection({ kind: "custom", id: role.id })}
                      className={cn(
                        "w-full rounded-xl border border-l-[3px] border-l-violet-500 px-4 py-4 text-left transition-all",
                        active
                          ? "border-primary/30 bg-primary/5 shadow-sm ring-1 ring-primary/10"
                          : "border-border/60 bg-background hover:border-border hover:shadow-sm",
                      )}
                    >
                      <span className="text-sm font-semibold">{roleCardTitle(role)}</span>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {roleCardDescription(role)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 tabular-nums">
                        <Users className="h-3 w-3" />
                        {role.member_count} members · {role.permissions.length} permissions
                      </p>
                    </button>
                  );
                })}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 text-xs gap-1"
                  onClick={() => setSelection({ kind: "new" })}
                >
                  <Plus className="h-3 w-3" />
                  Add another role
                </Button>
              </div>
            )}
          </div>
        </aside>

        <div className="flex flex-col min-h-0 min-w-0">
          <div className="p-6 lg:p-8 space-y-6 border-b border-border/40">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{editorTitle}</h3>
              {!isNew && roleData && (
                <p className="text-sm text-muted-foreground mt-0.5">{roleCardDescription(roleData)}</p>
              )}
              {isNew && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  Name your role and choose what they can access.
                </p>
              )}
            </div>

            {(isNew || isCustom) && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="role-name">Role name</Label>
                  <Input
                    id="role-name"
                    placeholder="Cashier, Receptionist…"
                    value={draftName}
                    onChange={(e) => {
                      setDraftName(e.target.value);
                      setDirty(true);
                    }}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="role-desc">Short description</Label>
                  <Input
                    id="role-desc"
                    placeholder="What they do on a typical day"
                    value={draftDescription}
                    onChange={(e) => {
                      setDraftDescription(e.target.value);
                      setDirty(true);
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="tabular-nums font-normal">
                {selectedCount} / {totalCount} selected
              </Badge>
              <span className="text-xs text-muted-foreground">
                Team members re-login to pick up changes
              </span>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search permissions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 lg:p-8 min-h-[420px] xl:min-h-[480px]">
            <PermissionsMatrix
              permissions={assignablePermissions}
              enabledModules={enabledModules}
              selected={draft}
              search={search}
              canEdit={canEdit}
              showDisabledModules={false}
              onTogglePermission={togglePermission}
              onToggleModule={toggleModule}
            />
          </div>

          {canEdit && (
            <SettingsStickyFooter className="mt-0 rounded-none border-x-0 border-b-0">
              {isSystem && selection.kind === "system" && roleData?.uses_override && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={resetSystemMutation.isPending}
                  onClick={() => resetSystemMutation.mutate(selection.name)}
                  className="gap-1.5 mr-auto"
                >
                  {resetSystemMutation.isPending ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <RotateCcw className="h-3.5 w-3.5" />
                  )}
                  Reset to default
                </Button>
              )}
              {isCustom && selection.kind === "custom" && roleData?.deletable && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-destructive hover:text-destructive mr-auto gap-1.5"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(selection.id)}
                >
                  {deleteMutation.isPending ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete role
                </Button>
              )}
              <Button
                type="button"
                disabled={(!dirty && !isNew) || saving}
                onClick={handleSave}
              >
                {saving && <Spinner className="mr-2 h-4 w-4" />}
                {isNew ? "Create role" : "Save changes"}
              </Button>
            </SettingsStickyFooter>
          )}
        </div>
      </div>
    </div>
  );
}
