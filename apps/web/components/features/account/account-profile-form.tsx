"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountApi, getApiErrorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/auth-session";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import type { AccountProfile } from "@/types/api";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(255),
  phone: z.string().max(20).optional(),
});

type FormValues = z.infer<typeof schema>;

type AccountProfileFormProps = {
  profile: AccountProfile;
};

export function AccountProfileForm({ profile }: AccountProfileFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: profile.name,
      phone: profile.phone ?? "",
    });
  }, [profile, reset]);

  const saveMutation = useMutation({
    mutationFn: accountApi.updateProfile,
    onSuccess: async (updated) => {
      queryClient.setQueryData(["account-profile"], updated);
      reset({
        name: updated.name,
        phone: updated.phone ?? "",
      });
      await authClient.updateUser({ name: updated.name });
      await syncAuthToken();
      toast.success("Profile saved");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onSubmit(data: FormValues) {
    saveMutation.mutate({
      name: data.name.trim(),
      phone: data.phone?.trim() ?? "",
    });
  }

  const busy = isSubmitting || saveMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      <div className="space-y-1.5">
        <Label htmlFor="account-name">Full name</Label>
        <Input id="account-name" autoComplete="name" {...register("name")} disabled={busy} />
        {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="account-email">Email</Label>
        <Input id="account-email" value={profile.email || "—"} disabled readOnly />
        <p className="text-xs text-muted-foreground">
          Email is tied to your sign-in account. Contact your business owner if it needs to change.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="account-phone">Phone</Label>
        <Input
          id="account-phone"
          autoComplete="tel"
          placeholder="+233…"
          {...register("phone")}
          disabled={busy}
        />
        {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
      </div>

      <Button type="submit" disabled={!isDirty || busy}>
        {busy ? <Spinner className="mr-2 h-4 w-4" /> : null}
        Save profile
      </Button>
    </form>
  );
}
