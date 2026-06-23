"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/shared/spinner";
import { AuthField } from "@/components/features/auth/auth-form-fields";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { OtpInput } from "@/components/features/auth/otp-input";
import { authClient } from "@/lib/auth-client";
import { resolvePostAuthPath, syncAuthToken } from "@/lib/auth-session";

function TwoFactorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [code, setCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function verifyTotp() {
    if (code.length < 6) {
      toast.error("Enter your 6-digit authenticator code");
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.twoFactor.verifyTotp({ code });
    setSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Invalid code");
      return;
    }

    const tokenRes = await syncAuthToken();
    if (!tokenRes?.token) {
      toast.error("Could not start session");
      return;
    }

    toast.success("Verified!");
    router.push(resolvePostAuthPath(tokenRes.onboarding_required, next));
  }

  async function verifyBackup() {
    if (!code.trim()) {
      toast.error("Enter a backup code");
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.twoFactor.verifyBackupCode({ code: code.trim() });
    setSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Invalid backup code");
      return;
    }

    const tokenRes = await syncAuthToken();
    if (!tokenRes?.token) {
      toast.error("Could not start session");
      return;
    }

    toast.success("Verified!");
    router.push(resolvePostAuthPath(tokenRes.onboarding_required, next));
  }

  return (
    <AuthPageShell
      title="Two-factor authentication"
      description={
        useBackup
          ? "Enter one of your backup recovery codes."
          : "Enter the code from your authenticator app."
      }
      footer={
        <p>
          <Link href="/login" className="auth-link">
            Back to sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        {useBackup ? (
          <AuthField
            id="backupCode"
            label="Backup code"
            placeholder="Backup code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
        ) : (
          <OtpInput value={code} onChange={setCode} disabled={submitting} />
        )}

        <button
          type="button"
          className="auth-btn-primary"
          disabled={submitting}
          onClick={useBackup ? verifyBackup : verifyTotp}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" className="text-white" />
              Verifying…
            </span>
          ) : (
            "Verify"
          )}
        </button>

        <button
          type="button"
          className="auth-btn-ghost"
          onClick={() => {
            setUseBackup((v) => !v);
            setCode("");
          }}
        >
          {useBackup ? "Use authenticator app instead" : "Use a backup code instead"}
        </button>
      </div>
    </AuthPageShell>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>}>
      <TwoFactorForm />
    </Suspense>
  );
}
