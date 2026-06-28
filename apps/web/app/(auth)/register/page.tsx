"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/shared/spinner";
import { AuthField, AuthPasswordField, AuthFormReveal } from "@/components/features/auth/auth-form-fields";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { authClient } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/auth-session";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes("email")) {
        setError("email", { message: "An account with this email already exists" });
      } else {
        setError("root", { message: error.message ?? "Registration failed" });
      }
      toast.error(error.message ?? "Registration failed");
      return;
    }

    const tokenRes = await syncAuthToken();
    if (!tokenRes?.token) {
      setError("root", { message: "Account created but session failed" });
      toast.error("Could not start session");
      return;
    }

    toast.success("Account created! Check your email to verify, then set up your business.");
    router.push("/onboarding");
  }

  return (
    <AuthPageShell
      title="Create your account"
      description="Free for your first 30 days. Manage sales, invoices, and your team."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <AuthField
          id="name"
          label="Full name"
          type="text"
          placeholder="Kwame Mensah"
          autoComplete="name"
          autoFocus
          revealDelay={0.1}
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          revealDelay={0.14}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthPasswordField
          id="password"
          label="Password"
          revealDelay={0.18}
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
          revealDelay={0.22}
          error={errors.confirmPassword?.message}
          registration={{
            ...register("confirmPassword"),
            autoComplete: "new-password",
            placeholder: "Re-enter your password",
          }}
        />

        {errors.root ? (
          <AuthFormReveal delay={0.22}>
            <div className="auth-alert-error">{errors.root.message}</div>
          </AuthFormReveal>
        ) : null}

        <AuthFormReveal delay={0.26}>
          <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </AuthFormReveal>

        <AuthFormReveal delay={0.3}>
          <p className="text-center text-xs auth-text-muted">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="auth-link">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="auth-link">
              Privacy Policy
            </Link>
          </p>
        </AuthFormReveal>
      </form>
    </AuthPageShell>
  );
}
