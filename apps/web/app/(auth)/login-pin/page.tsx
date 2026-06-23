"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@/components/shared/spinner";
import { AuthField } from "@/components/features/auth/auth-form-fields";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { OtpInput } from "@/components/features/auth/otp-input";
import { authClient } from "@/lib/auth-client";
import { resolvePostAuthPath, syncAuthToken } from "@/lib/auth-session";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type EmailForm = z.infer<typeof emailSchema>;

function LoginPinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  async function sendOtp(data: EmailForm) {
    setSending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: data.email,
      type: "sign-in",
    });
    setSending(false);

    if (error) {
      setError("root", { message: error.message ?? "Could not send code" });
      toast.error(error.message ?? "Could not send code");
      return;
    }

    setEmail(data.email);
    setStep("otp");
    toast.success("Sign-in code sent. Check your email or server console.");
  }

  async function signInWithOtp() {
    if (otp.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.signIn.emailOtp({ email, otp });
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

    toast.success("Signed in!");
    router.push(resolvePostAuthPath(tokenRes.onboarding_required, next));
  }

  async function resend() {
    if (!email) return;
    setSending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    setSending(false);
    if (error) toast.error(error.message ?? "Could not resend code");
    else toast.success("Code sent again.");
  }

  return (
    <AuthPageShell
      title="Login with PIN"
      description={
        step === "email"
          ? "We'll email you a one-time sign-in code."
          : `Enter the 6-digit code sent to ${email}`
      }
      footer={
        <p>
          Prefer password?{" "}
          <Link href="/login" className="auth-link">
            Sign in with password
          </Link>
        </p>
      }
    >
      {step === "email" ? (
        <form onSubmit={handleSubmit(sendOtp)} className="space-y-5" noValidate>
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
          <button type="submit" className="auth-btn-primary" disabled={isSubmitting || sending}>
            {isSubmitting || sending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Sending code…
              </span>
            ) : (
              "Send code"
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          <OtpInput value={otp} onChange={setOtp} disabled={submitting} />
          <button
            type="button"
            className="auth-btn-primary"
            disabled={submitting}
            onClick={signInWithOtp}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Verifying…
              </span>
            ) : (
              "Continue"
            )}
          </button>
          <p className="text-center text-sm auth-text-muted">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              className="auth-link border-none bg-transparent p-0 cursor-pointer"
              onClick={resend}
              disabled={sending}
            >
              Send again
            </button>
          </p>
          <button type="button" className="auth-btn-ghost" onClick={() => setStep("email")}>
            Use a different email
          </button>
        </div>
      )}
    </AuthPageShell>
  );
}

export default function LoginPinPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>}>
      <LoginPinForm />
    </Suspense>
  );
}
