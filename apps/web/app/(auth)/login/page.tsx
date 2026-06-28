"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { KeyRound } from "lucide-react";
import { Spinner } from "@/components/shared/spinner";
import { AuthField, AuthPasswordField, AuthFormReveal } from "@/components/features/auth/auth-form-fields";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { authClient } from "@/lib/auth-client";
import { resolvePostAuthPath, syncAuthToken } from "@/lib/auth-session";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { remember: true },
  });

  async function onSubmit(data: FormValues) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.remember,
    });

    if (error) {
      if (error.message?.toLowerCase().includes("verify")) {
        toast.error("Please verify your email first.");
        router.push("/verify-email");
        return;
      }
      setError("root", { message: error.message ?? "Invalid email or password" });
      toast.error(error.message ?? "Sign in failed");
      return;
    }

    const tokenRes = await syncAuthToken();
    if (tokenRes?.requires_branch_selection) {
      router.push(resolvePostAuthPath(false, true, next));
      return;
    }
    if (!tokenRes?.token) {
      setError("root", { message: "Could not start session" });
      toast.error("Could not start session");
      return;
    }

    toast.success("Welcome back!");
    router.push(
      resolvePostAuthPath(tokenRes.onboarding_required, false, next),
    );
  }

  return (
    <AuthPageShell
      title="Welcome back"
      description="Sign in to manage sales, invoices, and your team."
      footer={
        <p>
          New to Modufy?{" "}
          <Link href="/register" className="auth-link">
            Create a free account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <AuthField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          autoFocus
          revealDelay={0.08}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthPasswordField
          id="password"
          label="Password"
          revealDelay={0.12}
          error={errors.password?.message}
          registration={{
            ...register("password"),
            autoComplete: "current-password",
            placeholder: "Enter your password",
          }}
          labelAction={
            <Link href="/forgot-password" className="auth-link text-xs font-semibold">
              Forgot password?
            </Link>
          }
        />

        <AuthFormReveal delay={0.16}>
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm auth-text-muted">
            <input type="checkbox" className="auth-checkbox" {...register("remember")} />
            Keep me signed in on this device
          </label>
        </AuthFormReveal>

        {errors.root ? (
          <AuthFormReveal delay={0.18}>
            <div className="auth-alert-error">{errors.root.message}</div>
          </AuthFormReveal>
        ) : null}

        <AuthFormReveal delay={0.2}>
          <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </AuthFormReveal>

        <AuthFormReveal delay={0.24}>
          <div className="auth-divider">or</div>
        </AuthFormReveal>

        <AuthFormReveal delay={0.28}>
          <Link href="/login-pin" className="auth-btn-secondary">
            <KeyRound className="h-4 w-4 auth-icon-accent" />
            Sign in with email code
          </Link>
        </AuthFormReveal>
      </form>
    </AuthPageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
