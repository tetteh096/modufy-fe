"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, MailCheck, SendHorizonal, Lock } from "lucide-react";
import { Spinner } from "@/components/shared/spinner";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSentTo(data.email);
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#070c18", fontFamily: "var(--font-sans)" }}>

      {/* ════ LEFT — Brand Panel ════ */}
      <div className="hidden lg:flex flex-col w-[520px] shrink-0 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(160deg, #0d1a2e 0%, #091320 50%, #060c16 100%)",
        }} />
        <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full" style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(22,163,74,0.07) 40%, transparent 70%)",
        }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full" style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)",
        }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 30% 40%, black 20%, transparent 80%)",
          maskImage: "radial-gradient(ellipse 90% 85% at 30% 40%, black 20%, transparent 80%)",
        }} />
        <div className="absolute inset-y-0 right-0 w-px" style={{
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
        }} />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 0 0 1px rgba(34,197,94,0.3), 0 8px 24px rgba(34,197,94,0.4)",
            }}>
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-bold text-[17px] tracking-tight leading-none">Modufy</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mt-0.5" style={{ color: "rgba(74,222,128,0.6)" }}>Admin Console</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="mt-auto mb-10 space-y-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-2" style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}>
              <Lock className="h-7 w-7" style={{ color: "#4ade80" }} />
            </div>
            <h1 className="text-[2.4rem] font-bold leading-[1.1] tracking-tight text-white">
              Locked out?
              <br />
              <span style={{ background: "linear-gradient(90deg, #4ade80, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                We've got you.
              </span>
            </h1>
            <p className="text-[15px] leading-relaxed max-w-[280px]" style={{ color: "rgba(255,255,255,0.38)" }}>
              Enter the email linked to your admin account. We'll send a secure time-limited reset link straight to your inbox.
            </p>
          </div>

          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            © {new Date().getFullYear()} Modufy · Authorised access only
          </p>
        </div>
      </div>

      {/* ════ RIGHT — Form Panel ════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full" style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 65%)",
        }} />

        <div className="relative w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 0 20px rgba(34,197,94,0.5)",
            }}>
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Modufy Admin</span>
          </div>

          {sent ? (
            /* ── Success state ── */
            <>
              <div className="rounded-2xl p-10 flex flex-col items-center text-center" style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}>
                {/* Success icon */}
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1.5px solid rgba(34,197,94,0.25)",
                  }}>
                    <MailCheck className="h-10 w-10" style={{ color: "#4ade80" }} />
                  </div>
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-full" style={{
                    background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
                    transform: "scale(1.5)",
                  }} />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
                <p className="text-[14px] leading-relaxed mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  We sent a password reset link to
                </p>
                <p className="text-[14px] font-semibold mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {sentTo}
                </p>
                <p className="text-xs mb-8 px-4" style={{ color: "rgba(255,255,255,0.25)" }}>
                  The link expires in 30 minutes. Check your spam folder if you don't see it.
                </p>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "#4ade80" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8 space-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-5" style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}>
                  <Lock className="h-6 w-6" style={{ color: "#4ade80" }} />
                </div>
                <h2 className="text-[28px] font-bold tracking-tight" style={{ color: "#f8fafc" }}>
                  Reset password
                </h2>
                <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                  We'll email you a secure link to get back in
                </p>
              </div>

              {/* Glass card */}
              <div className="rounded-2xl p-8" style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@modufy.app"
                      autoComplete="email"
                      autoFocus
                      className="admin-input"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-xs" style={{ color: "#f87171" }}>{errors.email.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      color: "#fff",
                      boxShadow: "0 4px 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                    onMouseEnter={e => !isSubmitting && ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(34,197,94,0.55), inset 0 1px 0 rgba(255,255,255,0.2)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)")}
                  >
                    {isSubmitting ? (
                      <><Spinner size="sm" className="text-white" /> Sending…</>
                    ) : (
                      <>Send reset link <SendHorizonal className="h-4 w-4" /></>
                    )}
                  </button>
                </form>
              </div>

              <div className="flex justify-center mt-7">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[13px] font-medium transition-all hover:opacity-80"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)")}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            © {new Date().getFullYear()} Modufy · Restricted access
          </p>
        </div>
      </div>
    </div>
  );
}
