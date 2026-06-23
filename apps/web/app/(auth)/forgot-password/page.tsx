"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { Spinner } from "@/components/shared/spinner";
import { AuthField } from "@/components/features/auth/auth-form-fields";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError("root", { message: error.message ?? "Could not send reset email" });
      toast.error(error.message ?? "Could not send reset email");
      return;
    }

    toast.success("If an account exists, we sent reset instructions.");
  }

  return (
    <AuthPageShell
      title="Recover password"
      description="Enter your email and we'll send a reset link."
      footer={
        <p>
          Remember your password?{" "}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      }
    >
      {isSubmitSuccessful ? (
        <div className="space-y-5 text-center">
          <p className="auth-text-muted">
            Check your inbox for a password reset link. In development, check the API server console for the link.
          </p>
          <Link href="/login" className="auth-btn-primary">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <AuthField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
            error={errors.email?.message}
            {...register("email")}
          />

          {errors.root ? <div className="auth-alert-error">{errors.root.message}</div> : null}

          <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Sending…
              </span>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}
    </AuthPageShell>
  );
}
