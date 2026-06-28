"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { accountApi } from "@/lib/api";
import { formatActivityTime } from "@/lib/team-permissions";
import { formatTeamRole } from "@/lib/team-roles";
import { AccountAvatarField } from "@/components/features/account/account-avatar-field";
import { AccountProfileForm } from "@/components/features/account/account-profile-form";
import { ChangePasswordForm } from "@/components/features/account/change-password-form";
import { LockPinSettings } from "@/components/features/account/lock-pin-settings";
import { TwoFactorSettings } from "@/components/features/settings/two-factor-settings";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { TeamRoleBadge } from "@/components/features/team/team-role-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AccountTab = "profile" | "security" | "account";

function AccountContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab: AccountTab =
    tabParam === "security" || tabParam === "account" ? tabParam : "profile";

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["account-profile"],
    queryFn: accountApi.getProfile,
  });

  const initials = useMemo(
    () => (profile?.name?.trim() || profile?.email || "?").charAt(0).toUpperCase(),
    [profile?.name, profile?.email],
  );

  function setTab(tab: AccountTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "profile") params.delete("tab");
    else params.set("tab", tab);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  if (isLoading || !profile) {
    return <SectionLoader />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <p className="text-sm text-destructive">Could not load your account profile.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 overflow-x-hidden pb-16">
      <PageHeader
        title={profile.name || "My account"}
        description="Your personal profile, sign-in security, and account controls"
        action={
          profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="h-14 w-14 rounded-lg object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-xl font-bold text-primary">
              {initials}
            </div>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <TeamRoleBadge role={profile.role} />
        {profile.email ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {profile.email}
          </span>
        ) : null}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setTab(v as AccountTab)} className="w-full">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger value="profile" className="px-4">
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="px-4">
            Security
          </TabsTrigger>
          <TabsTrigger value="account" className="px-4">
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-8 space-y-6">
          <SettingsSection
            icon={User}
            title="Profile details"
            description="How you appear to teammates in Modufy."
          >
            <AccountAvatarField profile={profile} />
            <div className="border-t border-border/60 pt-6">
              <AccountProfileForm profile={profile} />
            </div>
          </SettingsSection>

          <SettingsSection icon={Clock} title="Activity on this account">
            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="mt-1 font-medium">{formatTeamRole(profile.role)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Member since</dt>
                <dd className="mt-1 font-medium">{formatActivityTime(profile.created_at)}</dd>
              </div>
              {profile.last_seen_at ? (
                <div>
                  <dt className="text-muted-foreground">Last sign-in</dt>
                  <dd className="mt-1 font-medium">{formatActivityTime(profile.last_seen_at)}</dd>
                </div>
              ) : null}
              {profile.phone ? (
                <div>
                  <dt className="text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </dt>
                  <dd className="mt-1 font-medium">{profile.phone}</dd>
                </div>
              ) : null}
            </dl>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="security" className="mt-8 space-y-6">
          <ChangePasswordForm disabled={!profile.has_login} />
          <TwoFactorSettings />
        </TabsContent>

        <TabsContent value="account" className="mt-8 space-y-6">
          <LockPinSettings />

          <SettingsSection
            icon={AlertTriangle}
            title="Deactivate account"
            description="Remove your access to this business. Business owners must transfer ownership first."
          >
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Deactivating signs you out and revokes your access to this business. You cannot undo
              this from the app — contact your business owner to be re-invited.
            </p>
            <Button render={<Link href="/deactivate" />} nativeButton={false} variant="outline">
              Deactivate my account
            </Button>
          </SettingsSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AccountView() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <AccountContent />
    </Suspense>
  );
}
