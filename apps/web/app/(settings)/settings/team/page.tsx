"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus, Shield, Users, ArrowRight } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { formatTeamRole } from "@/lib/team-roles";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { TeamRolesPanel } from "@/components/features/team/team-roles-panel";
import { TeamMembersList } from "@/components/features/team/team-members-list";
import { TeamRoleBadge } from "@/components/features/team/team-role-badge";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function TeamSettingsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "roles" ? "roles" : "members";
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: businessApi.team.list,
  });

  const deactivateMutation = useMutation({
    mutationFn: businessApi.team.deactivate,
    onSuccess: () => {
      toast.success("Team member removed");
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function setTab(tab: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "members") params.delete("tab");
    else params.set("tab", tab);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  if (isLoading) return <SectionLoader />;

  const members = data?.members ?? [];
  const pending = data?.pending_invites ?? [];

  return (
    <div className="space-y-8 w-full max-w-6xl">
      <PageHeader
        title="Team"
        description="People who can sign in to your BizOS account — each with a role that controls what they can do."
        action={
          <Button size="sm" className="gap-1.5" render={<Link href="/settings/team/new" />}>
            <UserPlus className="h-4 w-4" />
            Add member
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setTab}>
        <TabsList className="h-11 w-full sm:w-auto">
          <TabsTrigger value="members" className="px-5 flex-1 sm:flex-none">
            Members
          </TabsTrigger>
          <TabsTrigger value="roles" className="px-5 flex-1 sm:flex-none">
            Roles & permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-8 mt-8">
          <SettingsSection
            icon={Users}
            title={`Members (${members.length})`}
            description="Open a profile to change roles, review permissions, or remove access."
          >
            <TeamMembersList members={members} onRemove={(id) => deactivateMutation.mutate(id)} />
          </SettingsSection>

          {pending.length > 0 && (
            <SettingsSection
              title="Pending invites"
              description="Waiting to be accepted — they set their own password on the join page."
            >
              <div className="grid gap-3">
                {pending.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{inv.email || inv.phone}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatTeamRole(inv.role)} · expires{" "}
                        {new Date(inv.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    <TeamRoleBadge role={inv.role} />
                  </div>
                ))}
              </div>
            </SettingsSection>
          )}

          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-primary/25 bg-primary/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Roles & permissions</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-xl">
                  Customize Manager, Staff, and Accountant access — or create custom roles for your
                  team.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="gap-1.5 shrink-0"
              onClick={() => setTab("roles")}
            >
              Manage roles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-8 w-full">
          <TeamRolesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TeamSettingsPage() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <TeamSettingsContent />
    </Suspense>
  );
}
