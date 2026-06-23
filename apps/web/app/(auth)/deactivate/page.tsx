"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/shared/spinner";
import { AuthField, AuthPasswordField } from "@/components/features/auth/auth-form-fields";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { authClient } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/auth-session";
import { useAuthStore } from "@/store/auth";
import { useLockStore } from "@/store/lock";
import { accountApi } from "@/lib/api";

const schema = z.object({
  password: z.string().min(8, "Enter your password to confirm"),
  confirmText: z
    .string()
    .refine((v) => v === "DEACTIVATE", { message: 'Type "DEACTIVATE" to confirm' }),
});

type FormValues = {
  password: string;
  confirmText: string;
};

export default function DeactivateAccountPage() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const unlock = useLockStore((s) => s.unlock);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [sessionReady, setSessionReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const session = await authClient.getSession();
      if (!active) return;
      const authed = Boolean(session?.data?.user);
      setHasSession(authed);
      if (authed) await syncAuthToken();
      setSessionReady(true);
    }

    void loadSession();
    return () => {
      active = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    const email = useAuthStore.getState().user?.email;
    if (!email) {
      router.push("/login");
      return;
    }

    const { error: signInError } = await authClient.signIn.email({
      email,
      password: data.password,
    });

    if (signInError) {
      setError("password", { message: "Incorrect password" });
      toast.error("Incorrect password");
      return;
    }

    try {
      await accountApi.deactivate();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Could not deactivate account";
      setError("root", { message });
      toast.error(message);
      return;
    }

    await authClient.signOut();
    clearAuth();
    unlock();
    toast.success("Your account has been deactivated.");
    router.push("/login");
  }

  if (!sessionReady) {
    return (
      <AuthPageShell title="Account deactivation" description="Loading your session…">
        <div className="auth-status-block">
          <Spinner className="h-8 w-8" />
        </div>
      </AuthPageShell>
    );
  }

  if (!hasSession && !isAuthenticated) {
    return (
      <AuthPageShell title="Account deactivation" description="Sign in to manage your account.">
        <Link href="/login" className="auth-btn-primary">
          Sign in
        </Link>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Account deactivation"
      description="This will remove your access to this business. This action cannot be undone."
      footer={
        <p>
          <Link href="/account" className="auth-link">
            Cancel and go back
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <AuthPasswordField
          id="password"
          label="Confirm with your password"
          error={errors.password?.message}
          registration={{
            ...register("password"),
            autoComplete: "current-password",
            placeholder: "Enter your password",
          }}
        />

        <AuthField
          id="confirmText"
          label='Type DEACTIVATE to confirm'
          placeholder="DEACTIVATE"
          autoComplete="off"
          error={errors.confirmText?.message}
          {...register("confirmText")}
        />

        {errors.root ? <div className="auth-alert-error">{errors.root.message}</div> : null}

        <button type="submit" className="auth-btn-destructive" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" className="text-white" />
              Deactivating…
            </span>
          ) : (
            "Deactivate my account"
          )}
        </button>
      </form>
    </AuthPageShell>
  );
}
