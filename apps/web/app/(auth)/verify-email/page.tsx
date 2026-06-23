"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/shared/spinner";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { authClient } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/auth-session";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");
  const [status, setStatus] = useState<"idle" | "verifying" | "done" | "error">(
    token ? "verifying" : errorParam ? "error" : "idle"
  );
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    let active = true;

    async function verify() {
      if (!token) return;
      const { error } = await authClient.verifyEmail({ query: { token } });
      if (!active) return;

      if (error) {
        setStatus("error");
        toast.error(error.message ?? "Verification failed");
        return;
      }

      setStatus("done");
      await syncAuthToken();
      toast.success("Email verified!");
    }

    void verify();
    return () => {
      active = false;
    };
  }, [token]);

  async function resend() {
    setResending(true);
    const session = await authClient.getSession();
    const email = session?.data?.user?.email;

    if (!email) {
      toast.error("Sign in first to resend verification.");
      setResending(false);
      router.push("/login");
      return;
    }

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: `${window.location.origin}/verify-email`,
    });

    setResending(false);
    if (error) {
      toast.error(error.message ?? "Could not send verification email");
      return;
    }
    toast.success("Verification email sent. Check your inbox or server console.");
  }

  return (
    <AuthPageShell
      title="Confirm email"
      description="Verify your address to secure your account."
      footer={
        <p>
          <Link href="/login" className="auth-link">
            Back to sign in
          </Link>
        </p>
      }
    >
      {status === "verifying" ? (
        <div className="auth-status-block">
          <Spinner className="h-8 w-8" />
          <p className="auth-text-muted">Verifying your email…</p>
        </div>
      ) : null}

      {status === "done" ? (
        <div className="space-y-5 text-center">
          <p className="auth-text-muted">Your email is verified. You&apos;re all set.</p>
          <button type="button" className="auth-btn-primary" onClick={() => router.push("/dashboard")}>
            Continue to dashboard
          </button>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="space-y-5 text-center">
          <p className="auth-text-danger">This verification link is invalid or expired.</p>
          <button type="button" className="auth-btn-primary" onClick={resend} disabled={resending}>
            {resending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Sending…
              </span>
            ) : (
              "Resend verification email"
            )}
          </button>
        </div>
      ) : null}

      {status === "idle" ? (
        <div className="space-y-5">
          <p className="auth-text-muted text-center">
            We sent a confirmation link when you registered. Open it from your email, or resend below.
          </p>
          <button type="button" className="auth-btn-primary" onClick={resend} disabled={resending}>
            {resending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Sending…
              </span>
            ) : (
              "Resend verification email"
            )}
          </button>
        </div>
      ) : null}
    </AuthPageShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
