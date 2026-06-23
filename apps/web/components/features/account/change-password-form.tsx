"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/shared/spinner";
import { SettingsSection } from "@/components/features/settings/settings-section";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

type ChangePasswordFormProps = {
  disabled?: boolean;
};

export function ChangePasswordForm({ disabled }: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message ?? "Could not change password");
      return;
    }

    reset();
    toast.success("Password updated");
  }

  if (disabled) {
    return (
      <SettingsSection title="Password" icon={KeyRound}>
        <p className="text-sm text-muted-foreground">
          Your account does not use email and password sign-in, so there is no password to change here.
        </p>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      title="Password"
      icon={KeyRound}
      description="Choose a strong password you do not use on other sites."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            {...register("currentPassword")}
            disabled={isSubmitting}
          />
          {errors.currentPassword ? (
            <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
            disabled={isSubmitting}
          />
          {errors.newPassword ? (
            <p className="text-xs text-destructive">{errors.newPassword.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            disabled={isSubmitting}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Update password
        </Button>
      </form>
    </SettingsSection>
  );
}
