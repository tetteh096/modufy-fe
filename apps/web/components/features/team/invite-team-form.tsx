"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Copy, KeyRound, Link2, Mail, Phone, User, UserPlus } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { formatTeamRole } from "@/lib/team-roles";
import {
  TeamRolePicker,
  selectedRolePayload,
  type SelectedAssignRole,
} from "@/components/features/team/team-role-picker";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import { PageHeader } from "@/components/shared/page-header";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TeamInviteCreated } from "@/types/api";

const inviteSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  provision_account: z.boolean(),
});

type InviteForm = z.infer<typeof inviteSchema>;

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied`);
}

export function InviteTeamForm() {
  const router = useRouter();
  const [result, setResult] = useState<TeamInviteCreated | null>(null);
  const [assignRole, setAssignRole] = useState<SelectedAssignRole>({
    type: "system",
    name: "staff",
  });
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { provision_account: true },
  });

  const email = watch("email");
  const provisionAccount = watch("provision_account");

  useEffect(() => {
    if (email && provisionAccount === false) {
      setValue("provision_account", true);
    }
  }, [email, provisionAccount, setValue]);

  const inviteMutation = useMutation({
    mutationFn: businessApi.team.invite,
    onSuccess: (res) => {
      setResult(res);
      toast.success(res.provisioned ? "Login created" : "Invite created");
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onSubmit(data: InviteForm) {
    if (!data.email && !data.phone) {
      toast.error("Email or phone is required");
      return;
    }
    if (data.provision_account && !data.email) {
      toast.error("Email is required to create a login");
      return;
    }
    if (data.provision_account && !data.name?.trim()) {
      toast.error("Name is required to create a login");
      return;
    }
    inviteMutation.mutate({
      email: data.email || undefined,
      phone: data.phone,
      name: data.name?.trim() || undefined,
      provision_account: data.provision_account,
      ...selectedRolePayload(assignRole),
    });
  }

  const joinLink =
    result?.join_path && typeof window !== "undefined"
      ? `${window.location.origin}${result.join_path}`
      : result?.join_path ?? null;

  if (result) {
    return (
      <div className="space-y-8 w-full max-w-4xl">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2" render={<Link href="/settings/team" />}>
          <ArrowLeft className="h-4 w-4" />
          Back to team
        </Button>

        <PageHeader
          title="Member added"
          description="Share the details below securely — they are only shown once."
        />

        <SettingsSection icon={UserPlus} title="Share with your team member">
          {result.provisioned ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
                <p className="text-sm font-medium flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  Login credentials
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.delivery_note}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-background border px-4 py-3">
                    <span className="truncate text-sm">{email}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => copyText(email ?? "", "Email")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-background border px-4 py-3 font-mono text-sm">
                    <span>{result.temp_password}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyText(result.temp_password ?? "", "Password")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full gap-2"
                  onClick={() =>
                    copyText(
                      `BizOS login\nEmail: ${email}\nTemporary password: ${result.temp_password}\nSign in: ${typeof window !== "undefined" ? window.location.origin : ""}/login`,
                      "Credentials",
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                  Copy all credentials
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Role: <strong>{formatTeamRole(result.role)}</strong>. They should change their password under{" "}
                <Link href="/account?tab=security" className="text-primary font-medium hover:underline">
                  My account → Security
                </Link>{" "}
                after first sign-in.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Invite link
              </p>
              <p className="text-sm break-all font-mono bg-background rounded-lg border px-4 py-3">{joinLink}</p>
              <Button type="button" variant="secondary" className="gap-2" onClick={() => copyText(joinLink ?? "", "Invite link")}>
                <Copy className="h-4 w-4" />
                Copy invite link
              </Button>
              <p className="text-sm text-muted-foreground">{result.delivery_note}</p>
            </div>
          )}
        </SettingsSection>

        <div className="flex gap-3">
          <Button variant="outline" render={<Link href="/settings/team" />}>
            Back to team
          </Button>
          <Button
            onClick={() => {
              setResult(null);
              reset({ email: "", phone: "", name: "", provision_account: true });
              setAssignRole({ type: "system", name: "staff" });
            }}
          >
            Add another
          </Button>
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-8 w-full max-w-4xl">
      <Button variant="ghost" size="sm" className="gap-2 -ml-2" render={<Link href="/settings/team" />}>
        <ArrowLeft className="h-4 w-4" />
        Back to team
      </Button>

      <PageHeader
        title="Add team member"
        description="Create a login with a temporary password, or send an invite link so they choose their own password."
      />

      <form id="team-invite-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <SettingsSection icon={User} title="Person details">
          <div className="grid gap-5 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Full name</Label>
              <Input id="invite-name" placeholder="Kofi Mensah" {...register("name")} />
              <p className="text-xs text-muted-foreground">Required when creating a login directly.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input id="invite-email" type="email" placeholder="colleague@example.com" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-phone">Phone (optional)</Label>
              <Input id="invite-phone" type="tel" placeholder="+233…" {...register("phone")} />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Access">
          <label className="flex items-start gap-3 rounded-xl border px-4 py-4 cursor-pointer hover:bg-muted/20 mb-6">
            <Checkbox
              checked={provisionAccount}
              onCheckedChange={(v) => setValue("provision_account", v === true)}
              disabled={!email}
              className="mt-1"
            />
            <span>
              <span className="text-sm font-medium block">Create login with temporary password</span>
              <span className="text-sm text-muted-foreground block mt-1 leading-relaxed">
                Share credentials in person or on WhatsApp. SMS and email delivery are not wired yet.
              </span>
            </span>
          </label>

          <div className="space-y-3">
            <Label>Role</Label>
            <TeamRolePicker value={assignRole} onChange={setAssignRole} />
          </div>
        </SettingsSection>

        <SettingsStickyFooter>
          <Button type="button" variant="outline" className="mr-auto" render={<Link href="/settings/team" />}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || inviteMutation.isPending}>
            {(isSubmitting || inviteMutation.isPending) && <Spinner className="mr-2 h-4 w-4" />}
            {provisionAccount && email ? "Create login" : "Create invite link"}
          </Button>
        </SettingsStickyFooter>
      </form>
    </div>
  );
}
