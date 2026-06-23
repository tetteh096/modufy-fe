"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Activity,
  ArrowLeft,
  Clock,
  Copy,
  KeyRound,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { AuditEventList } from "@/components/features/audit/audit-event-list";
import {
  filterAssignablePermissions,
  formatActivityTime,
  isAssignablePermission,
} from "@/lib/team-permissions";
import { formatTeamRole } from "@/lib/team-roles";
import {
  TeamRolePicker,
  selectedRolePayload,
  type SelectedAssignRole,
} from "@/components/features/team/team-role-picker";
import { PermissionsMatrix, roleCardTitle } from "@/components/features/team/permissions-matrix";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Spinner } from "@/components/shared/spinner";
import { TeamRoleBadge } from "@/components/features/team/team-role-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ResetMemberPasswordResult, TeamRoleWithPermissions } from "@/types/api";

type MemberTab = "details" | "activity" | "permissions" | "security";

function toSelectedRole(roleName: string, roles: TeamRoleWithPermissions[]): SelectedAssignRole {
  const match = roles.find((r) => r.name === roleName);
  if (!match) return { type: "system", name: "staff" };
  if (match.is_system) return { type: "system", name: match.name };
  return {
    type: "custom",
    id: match.id,
    name: match.name,
    display_name: match.display_name,
  };
}

function rolesEqual(a: SelectedAssignRole, b: SelectedAssignRole): boolean {
  if (a.type !== b.type) return false;
  if (a.type === "system" && b.type === "system") return a.name === b.name;
  if (a.type === "custom" && b.type === "custom") return a.id === b.id;
  return false;
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const k of a) if (!b.has(k)) return false;
  return true;
}

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied`);
}

function MemberDetailContent({ memberId }: { memberId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const tabParam = searchParams.get("tab");
  const activeTab: MemberTab =
    tabParam === "activity" || tabParam === "permissions" || tabParam === "security"
      ? tabParam
      : "details";

  const [selectedRole, setSelectedRole] = useState<SelectedAssignRole>({
    type: "system",
    name: "staff",
  });
  const [initialRole, setInitialRole] = useState<SelectedAssignRole>({
    type: "system",
    name: "staff",
  });
  const [permDraft, setPermDraft] = useState<Set<string>>(new Set());
  const [permSearch, setPermSearch] = useState("");
  const [resetResult, setResetResult] = useState<ResetMemberPasswordResult | null>(null);

  const { data: detail, isLoading, error } = useQuery({
    queryKey: ["team-member", memberId],
    queryFn: () => businessApi.team.getMember(memberId),
  });

  const { data: rolesData } = useQuery({
    queryKey: ["team-roles"],
    queryFn: businessApi.team.listRoles,
  });

  const { data: modulesData } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (detail && rolesData?.roles) {
      const roleName = detail.roles.find((r) => r !== "owner") ?? detail.roles[0] ?? "staff";
      const sel = toSelectedRole(roleName, rolesData.roles);
      setSelectedRole(sel);
      setInitialRole(sel);
      setPermDraft(new Set((detail.permissions ?? []).filter(isAssignablePermission)));
    }
  }, [detail, rolesData?.roles]);

  const enabledModules = useMemo(
    () => (modulesData?.modules ?? []).filter((m) => m.enabled).map((m) => m.module),
    [modulesData?.modules],
  );

  const assignablePermissions = useMemo(
    () => filterAssignablePermissions(rolesData?.permissions ?? []),
    [rolesData?.permissions],
  );

  const savedPermSet = useMemo(
    () => new Set((detail?.permissions ?? []).filter(isAssignablePermission)),
    [detail?.permissions],
  );

  const rolePermSet = useMemo(
    () => new Set((detail?.role_permissions ?? []).filter(isAssignablePermission)),
    [detail?.role_permissions],
  );

  const permDirty = detail ? !setsEqual(permDraft, savedPermSet) : false;

  function setTab(tab: MemberTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "details") params.delete("tab");
    else params.set("tab", tab);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const updateRoleMutation = useMutation({
    mutationFn: () => businessApi.team.updateRole(memberId, selectedRolePayload(selectedRole)),
    onSuccess: () => {
      toast.success("Role updated");
      setInitialRole(selectedRole);
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["team-member", memberId] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const resetPermissionsMutation = useMutation({
    mutationFn: () =>
      businessApi.team.updateMemberPermissions(memberId, [...rolePermSet].sort()),
    onSuccess: () => {
      toast.success("Permissions reset to role defaults");
      setPermDraft(new Set(rolePermSet));
      queryClient.invalidateQueries({ queryKey: ["team-member", memberId] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const savePermissionsMutation = useMutation({
    mutationFn: () => businessApi.team.updateMemberPermissions(memberId, [...permDraft].sort()),
    onSuccess: () => {
      toast.success("Permissions saved — member should sign in again to apply changes");
      queryClient.invalidateQueries({ queryKey: ["team-member", memberId] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () => businessApi.team.resetPassword(memberId),
    onSuccess: (res) => {
      setResetResult(res);
      toast.success("Temporary password created");
      queryClient.invalidateQueries({ queryKey: ["team-member", memberId] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const deactivateMutation = useMutation({
    mutationFn: () => businessApi.team.deactivate(memberId),
    onSuccess: () => {
      toast.success("Team member removed");
      queryClient.invalidateQueries({ queryKey: ["team"] });
      router.push("/settings/team");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (isLoading) return <SectionLoader />;

  if (error || !detail?.id) {
    return (
      <div className="max-w-3xl space-y-4 overflow-x-hidden">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2" render={<Link href="/settings/team" />}>
          <ArrowLeft className="h-4 w-4" />
          Back to team
        </Button>
        <p className="text-sm text-muted-foreground">This team member could not be found.</p>
      </div>
    );
  }

  const isOwner = detail.roles.includes("owner");
  const currentRoleName =
    detail.roles.find((r) => r !== "owner") ?? detail.roles[0] ?? "staff";
  const currentRoleMeta = rolesData?.roles.find((r) => r.name === currentRoleName);
  const overrideCount = detail.permission_overrides?.length ?? 0;

  function togglePermission(key: string, checked: boolean) {
    setPermDraft((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  function toggleModule(keys: string[], enable: boolean) {
    setPermDraft((prev) => {
      const next = new Set(prev);
      for (const key of keys) {
        if (enable) next.add(key);
        else next.delete(key);
      }
      return next;
    });
  }

  function resetPermissionsToRole() {
    resetPermissionsMutation.mutate();
  }

  return (
    <div className="space-y-8 w-full max-w-6xl overflow-x-hidden pb-10">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 -ml-2 text-muted-foreground"
        render={<Link href="/settings/team" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to team
      </Button>

      <PageHeader
        title={detail.name?.trim() || detail.email || "Team member"}
        description="Manage profile, activity, permissions, and security."
        action={
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary text-xl font-bold">
            {(detail.name?.trim() || detail.email || "?").charAt(0).toUpperCase()}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {detail.roles.map((r) => (
          <TeamRoleBadge key={r} role={r} />
        ))}
        {detail.uses_permission_overrides && (
          <Badge variant="outline" className="text-[10px]">
            Custom permissions
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setTab(v as MemberTab)}>
        <TabsList className="h-11 w-full grid grid-cols-2 sm:flex sm:w-auto">
          <TabsTrigger value="details" className="px-4">
            Details
          </TabsTrigger>
          <TabsTrigger value="activity" className="px-4">
            Activity
          </TabsTrigger>
          <TabsTrigger value="permissions" className="px-4">
            Permissions
          </TabsTrigger>
          <TabsTrigger value="security" className="px-4">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-8 space-y-6">
          <SettingsSection icon={User} title="Contact" description="How to reach this person.">
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              {detail.email && (
                <div className="rounded-lg border bg-muted/20 px-4 py-3">
                  <dt className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </dt>
                  <dd className="font-medium break-all">{detail.email}</dd>
                </div>
              )}
              {detail.phone && (
                <div className="rounded-lg border bg-muted/20 px-4 py-3">
                  <dt className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </dt>
                  <dd className="font-medium">{detail.phone}</dd>
                </div>
              )}
              <div className="rounded-lg border bg-muted/20 px-4 py-3">
                <dt className="text-xs text-muted-foreground mb-1">Joined</dt>
                <dd className="font-medium">{formatActivityTime(detail.created_at)}</dd>
              </div>
              {detail.last_seen_at && (
                <div className="rounded-lg border bg-muted/20 px-4 py-3">
                  <dt className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    Last signed in
                  </dt>
                  <dd className="font-medium">{formatActivityTime(detail.last_seen_at)}</dd>
                </div>
              )}
            </dl>
          </SettingsSection>

          {isOwner ? (
            <SettingsSection title="Owner account">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The business owner always has full access. Transfer ownership will be a separate
                flow later.
              </p>
            </SettingsSection>
          ) : (
            <SettingsSection
              title="Role"
              description={`Current: ${formatTeamRole(currentRoleName, currentRoleMeta ? roleCardTitle(currentRoleMeta) : undefined)}`}
            >
              <TeamRolePicker value={selectedRole} onChange={setSelectedRole} compact />
              <Button
                className="mt-4"
                disabled={updateRoleMutation.isPending || rolesEqual(selectedRole, initialRole)}
                onClick={() => updateRoleMutation.mutate()}
              >
                {updateRoleMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
                Save role
              </Button>
            </SettingsSection>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-8">
          <SettingsSection
            icon={Activity}
            title="Account activity"
            description="Actions involving this team member — sign-ins, role changes, and work they performed."
          >
            <AuditEventList
              events={detail.activity.map((item, index) => ({
                id: `${item.event}-${item.at}-${index}`,
                action: item.event,
                description: item.description,
                actor_user_id: null,
                actor_name: item.actor_name ?? "",
                resource_type: "",
                resource_id: "",
                resource_label: item.resource_label ?? "",
                created_at: item.at,
              }))}
              emptyTitle="No activity yet"
              emptyDescription="Events will appear here when this member signs in or performs actions in BizOS."
              showActor={false}
            />
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Owners and managers can view the full business log in{" "}
              <Link href="/settings/activity" className="text-primary underline-offset-4 hover:underline">
                Settings → Activity log
              </Link>
              .
            </p>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="permissions" className="mt-8">
          {isOwner ? (
            <SettingsSection icon={Shield} title="Owner permissions">
              <p className="text-sm text-muted-foreground rounded-lg border border-dashed px-4 py-4">
                Owners bypass permission checks and have full access to everything.
              </p>
            </SettingsSection>
          ) : (
            <div className="rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border/50 bg-muted/20 px-6 py-5">
                <h2 className="text-base font-semibold tracking-tight">Permissions</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                  Starts from their role ({rolePermSet.size} permissions). Turn individual access on
                  or off for this person only — without changing the role for everyone else.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <Badge variant="secondary" className="tabular-nums font-normal">
                    {permDraft.size} selected
                  </Badge>
                  {overrideCount > 0 && (
                    <Badge variant="outline" className="text-[10px]">
                      {overrideCount} override{overrideCount !== 1 ? "s" : ""} saved
                    </Badge>
                  )}
                  {!detail.can_manage_permissions && (
                    <span className="text-xs text-muted-foreground">
                      Only owners and managers can edit permissions.
                    </span>
                  )}
                </div>
                <div className="relative max-w-md mt-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search permissions…"
                    value={permSearch}
                    onChange={(e) => setPermSearch(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <PermissionsMatrix
                  permissions={assignablePermissions}
                  enabledModules={enabledModules}
                  selected={permDraft}
                  search={permSearch}
                  canEdit={detail.can_manage_permissions}
                  showDisabledModules={false}
                  onTogglePermission={togglePermission}
                  onToggleModule={toggleModule}
                />
              </div>

              {detail.can_manage_permissions && (
                <SettingsStickyFooter className="mt-0 rounded-none border-x-0 border-b-0">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1.5 mr-auto"
                    disabled={
                      (!detail.uses_permission_overrides && setsEqual(permDraft, rolePermSet)) ||
                      resetPermissionsMutation.isPending
                    }
                    onClick={resetPermissionsToRole}
                  >
                    {resetPermissionsMutation.isPending ? (
                      <Spinner className="h-3.5 w-3.5" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                    Reset to role defaults
                  </Button>
                  <Button
                    type="button"
                    disabled={!permDirty || savePermissionsMutation.isPending}
                    onClick={() => savePermissionsMutation.mutate()}
                  >
                    {savePermissionsMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
                    Save permissions
                  </Button>
                </SettingsStickyFooter>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="security" className="mt-8 space-y-6">
          {!isOwner && detail.can_reset_password && (
            <SettingsSection
              icon={Lock}
              title="Password"
              description="Help them sign in when they forget their password."
            >
              {resetResult ? (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary" />
                    Temporary password — share once
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {resetResult.delivery_note}
                  </p>
                  <div className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3 font-mono text-sm">
                    <span>{resetResult.temp_password}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyText(resetResult.temp_password, "Password")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-2"
                    onClick={() =>
                      copyText(
                        `BizOS login\nEmail: ${detail.email}\nTemporary password: ${resetResult.temp_password}\nSign in: ${typeof window !== "undefined" ? window.location.origin : ""}/login`,
                        "Credentials",
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                    Copy all credentials
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Generate a temporary password for{" "}
                    <span className="font-medium text-foreground">{detail.name}</span>. They should
                    change it after signing in.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger render={<Button type="button" className="gap-2" />}>
                      <KeyRound className="h-4 w-4" />
                      Reset password
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset password for {detail.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Creates a new temporary password and replaces their current one. Share it
                          securely so they can sign in.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => resetPasswordMutation.mutate()}
                          disabled={resetPasswordMutation.isPending}
                        >
                          {resetPasswordMutation.isPending && (
                            <Spinner className="mr-2 h-4 w-4" />
                          )}
                          Generate password
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </SettingsSection>
          )}

          {!isOwner && (
            <SettingsSection
              title="Remove access"
              description="They will immediately lose access to this business."
              className="border-destructive/20"
            >
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="text-destructive hover:text-destructive gap-2"
                    />
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Remove from team
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {detail.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      They will lose access to this business immediately. You can invite them again
                      later if needed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => deactivateMutation.mutate()}
                      disabled={deactivateMutation.isPending}
                    >
                      {deactivateMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
                      Remove access
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SettingsSection>
          )}

          {isOwner && (
            <SettingsSection title="Owner account">
              <p className="text-sm text-muted-foreground">
                Password and removal controls do not apply to the business owner here.
              </p>
            </SettingsSection>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function TeamMemberDetailView({ memberId }: { memberId: string }) {
  return (
    <Suspense fallback={<SectionLoader />}>
      <MemberDetailContent memberId={memberId} />
    </Suspense>
  );
}
