"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Spinner } from "@/components/shared/spinner";
import { AuthPasswordField } from "@/components/features/auth/auth-form-fields";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { authClient } from "@/lib/auth-client";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const tokenError = useMemo(() => {
    if (errorParam) return "This reset link is invalid or expired. Request a new one.";
    if (!token) return "Missing reset token. Open the link from your email.";
    return null;
  }, [errorParam, token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    if (!token) return;

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    if (error) {
      setError("root", { message: error.message ?? "Could not reset password" });
      toast.error(error.message ?? "Could not reset password");
      return;
    }

    toast.success("Password updated. You can sign in now.");
    router.push("/login");
  }

  return (
    <AuthPageShell
      title="Create password"
      description="Choose a new password for your account."
      footer={
        <p>
          <Link href="/forgot-password" className="auth-link">
            Request a new link
          </Link>
        </p>
      }
    >
      {tokenError ? (
        <div className="space-y-5 text-center">
          <p className="auth-text-danger">{tokenError}</p>
          <Link href="/forgot-password" className="auth-btn-primary">
            Recover password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <AuthPasswordField
            id="password"
            label="New password"
            error={errors.password?.message}
            registration={{
              ...register("password"),
              autoComplete: "new-password",
              placeholder: "Min 8 chars, 1 uppercase, 1 number",
            }}
          />
          <AuthPasswordField
            id="confirmPassword"
            label="Confirm password"
            error={errors.confirmPassword?.message}
            registration={{
              ...register("confirmPassword"),
              autoComplete: "new-password",
              placeholder: "Re-enter your password",
            }}
          />

          {errors.root ? <div className="auth-alert-error">{errors.root.message}</div> : null}

          <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Saving…
              </span>
            ) : (
              "Save password"
            )}
          </button>
        </form>
      )}
    </AuthPageShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
