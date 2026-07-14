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
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function TeamRolesPanel() {
  const queryClient = useQueryClient();
  const [selection, setSelection] = useState<RoleSelection>({ kind: "system", name: "manager" });
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

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
      setPanelOpen(false);
      queryClient.invalidateQueries({ queryKey: ["team-roles"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const resetSystemMutation = useMutation({
    mutationFn: (name: string) => businessApi.team.resetRolePermissions(name),
    onSuccess: () => {
      toast.success("Restored Modufy defaults");
      setPanelOpen(false);
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
      setPanelOpen(false);
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
      setPanelOpen(false);
      queryClient.invalidateQueries({ queryKey: ["team-roles"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => businessApi.team.deleteCustomRole(id),
    onSuccess: () => {
      toast.success("Custom role deleted");
      setSelection({ kind: "system", name: "manager" });
      setPanelOpen(false);
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
    <div className="space-y-8">
      {/* Overview / Header card */}
      <div className="rounded-xl border border-border/70 bg-card shadow-sm p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Shield className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Roles & permissions</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
              Choose a template or build custom roles to control what your team can access.
              Permissions only apply to modules your business has enabled.
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => {
            setSelection({ kind: "new" });
            setPanelOpen(true);
          }}
          className="gap-1.5 shrink-0 self-start sm:self-center cursor-pointer font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Create custom role
        </Button>
      </div>

      {/* Templates Section */}
      <div className="space-y-4">
        <div className="px-1">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Role Templates</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Predefined operational roles with standard baseline permissions.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {systemRoles.map((role) => {
            const accent = SYSTEM_ROLE_ACCENT[role.name] ?? "border-l-primary";
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelection({ kind: "system", name: role.name });
                  setPanelOpen(true);
                }}
                className={cn(
                  "group relative text-left rounded-xl border bg-card p-6 flex flex-col justify-between gap-5 hover:border-primary/25 hover:shadow-xs transition-all duration-200 cursor-pointer border-l-[3px]",
                  accent
                )}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-[0.95rem] group-hover:text-primary transition-colors">
                      {roleCardTitle(role)}
                    </span>
                    {role.uses_override && (
                      <Badge variant="outline" className="text-[10px] bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/30 font-medium">
                        Customized
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {roleCardDescription(role)}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[10px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground/60" />
                    {role.member_count} member{role.member_count === 1 ? "" : "s"}
                  </span>
                  <span>
                    {role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Roles Section */}
      <div className="space-y-4">
        <div className="px-1">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Custom Roles</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Granular roles created for your business operations.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {customRoles.map((role) => {
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelection({ kind: "custom", id: role.id });
                  setPanelOpen(true);
                }}
                className="group relative text-left rounded-xl border bg-card p-6 flex flex-col justify-between gap-5 hover:border-primary/25 hover:shadow-xs transition-all duration-200 cursor-pointer border-l-[3px] border-l-violet-500"
              >
                <div className="space-y-1.5">
                  <span className="font-semibold text-foreground text-[0.95rem] group-hover:text-primary transition-colors">
                    {roleCardTitle(role)}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {roleCardDescription(role) || "No description provided."}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[10px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground/60" />
                    {role.member_count} member{role.member_count === 1 ? "" : "s"}
                  </span>
                  <span>
                    {role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"}
                  </span>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setSelection({ kind: "new" });
              setPanelOpen(true);
            }}
            className="w-full text-center rounded-xl border border-dashed p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/[0.01] transition-all cursor-pointer min-h-[140px] group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/65 group-hover:bg-primary/10 group-hover:scale-105 transition-all">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-foreground">Create custom role</p>
              <p className="text-xs text-muted-foreground">Add cashiers, baristas, or stock managers.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Slide-out Panel (Sheet) */}
      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent className="data-[side=right]:sm:max-w-2xl p-0 flex flex-col h-full border-l border-border/60">
          <div className="bg-gradient-to-br from-primary/10 via-primary/[0.03] to-background p-6 pb-5 border-b border-border/40 shrink-0">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                <Shield className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-0 pt-0.5 space-y-1">
                <SheetTitle className="text-base font-bold tracking-tight text-foreground">
                  {editorTitle}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  {isNew 
                    ? "Set up a new role with specific baseline access permissions."
                    : roleData?.description || "Configure access permissions for this team role."
                  }
                </SheetDescription>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {(isNew || isCustom) && (
              <div className="space-y-4 bg-muted/10 p-4.5 rounded-xl border border-border/40">
                <div className="space-y-1.5">
                  <Label htmlFor="role-name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role Name</Label>
                  <Input
                    id="role-name"
                    placeholder="e.g. Cashier, Receptionist"
                    value={draftName}
                    onChange={(e) => {
                      setDraftName(e.target.value);
                      setDirty(true);
                    }}
                    className="h-10 bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role-desc" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</Label>
                  <Input
                    id="role-desc"
                    placeholder="e.g. Can record sales and adjust stock levels"
                    value={draftDescription}
                    onChange={(e) => {
                      setDraftDescription(e.target.value);
                      setDirty(true);
                    }}
                    className="h-10 bg-background"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="tabular-nums font-semibold px-2">
                    {selectedCount} / {totalCount} permissions selected
                  </Badge>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
                  <Input
                    placeholder="Search permissions…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 bg-background text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
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
            </div>
          </div>

          <div className="bg-muted/30 border-t border-border/40 px-6 py-4 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 mr-auto">
              {isSystem && selection.kind === "system" && roleData?.uses_override && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={resetSystemMutation.isPending}
                  onClick={() => resetSystemMutation.mutate(selection.name)}
                  className="gap-1.5 text-xs font-semibold"
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
                  size="sm"
                  className="text-destructive hover:text-destructive gap-1.5 text-xs font-semibold"
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
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPanelOpen(false)}
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={(!dirty && !isNew) || saving}
                onClick={handleSave}
                className="font-semibold shadow-xs"
              >
                {saving && <Spinner className="mr-2 h-4 w-4" />}
                {isNew ? "Create role" : "Save changes"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
