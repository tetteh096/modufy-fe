"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShieldCheck, LayoutGrid, LifeBuoy, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Spinner } from "@/components/shared/spinner";
import { authClient } from "@/lib/auth-client";
import { useAdminStore } from "@/store/admin";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

const STATS = [
  { value: "99.9%", label: "Uptime SLA", icon: Zap },
  { value: "12k+", label: "Businesses", icon: LayoutGrid },
  { value: "< 80ms", label: "API p95", icon: LifeBuoy },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAdminStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError("root", { message: "Invalid credentials. Please try again." });
      toast.error("Sign in failed");
      return;
    }

    const res = await fetch("/api/auth/token");
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      const msg =
        body.error === "Not an admin account"
          ? "This account does not have admin access."
          : "Sign in failed. Check your credentials.";
      setError("root", { message: msg });
      toast.error(msg);
      await authClient.signOut();
      return;
    }

    const { token } = (await res.json()) as { token: string };
    const session = await authClient.getSession();
    if (session?.data?.user && token) {
      setAuth(token, {
        id: session.data.user.id,
        email: session.data.user.email,
        name: session.data.user.name,
      });
    }

    toast.success("Welcome back.");
    router.push("/businesses");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#070c18", fontFamily: "var(--font-sans)" }}>

      {/* ════ LEFT — Brand Panel ════ */}
      <div className="hidden lg:flex flex-col w-[520px] shrink-0 relative overflow-hidden">

        {/* Multi-layer background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(160deg, #0d1a2e 0%, #091320 50%, #060c16 100%)",
        }} />

        {/* Giant green glow orb */}
        <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full" style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(22,163,74,0.07) 40%, transparent 70%)",
          filter: "blur(1px)",
        }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full" style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)",
        }} />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 30% 40%, black 20%, transparent 80%)",
          maskImage: "radial-gradient(ellipse 90% 85% at 30% 40%, black 20%, transparent 80%)",
        }} />

        {/* Right edge separator line */}
        <div className="absolute inset-y-0 right-0 w-px" style={{
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
        }} />

        {/* Content */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#4ade80",
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Platform operations
            </div>

            <h1 className="text-[2.6rem] font-bold leading-[1.1] tracking-tight text-white">
              The control
              <br />
              centre for
              <br />
              <span style={{ background: "linear-gradient(90deg, #4ade80, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                every business.
              </span>
            </h1>

            <p className="text-[15px] leading-relaxed max-w-[300px]" style={{ color: "rgba(255,255,255,0.38)" }}>
              Manage tenants, modules, billing, and support from a single secure command centre.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-3 mb-12">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex-1 rounded-2xl p-4" style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}>
                <Icon className="h-4 w-4 mb-2" style={{ color: "rgba(74,222,128,0.7)" }} />
                <p className="text-xl font-bold tabular-nums" style={{
                  background: "linear-gradient(120deg, #4ade80, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>{value}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            © {new Date().getFullYear()} Modufy · Authorised access only
          </p>
        </div>
      </div>

      {/* ════ RIGHT — Form Panel ════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">

        {/* Ambient glow */}
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

          {/* Icon + heading */}
          <div className="mb-8 space-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-5" style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}>
              <ShieldCheck className="h-6 w-6" style={{ color: "#4ade80" }} />
            </div>
            <h2 className="text-[28px] font-bold tracking-tight" style={{ color: "#f8fafc" }}>
              Welcome back
            </h2>
            <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.38)" }}>
              Authorised Modufy team members only
            </p>
          </div>

          {/* Glass card */}
          <div className="rounded-2xl p-8" style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

              {/* Email */}
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

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[13px] font-semibold transition-colors hover:opacity-80" style={{ color: "#4ade80" }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="admin-input pr-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center transition-colors"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide" : "Show"}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs" style={{ color: "#f87171" }}>{errors.password.message}</p>}
              </div>

              {/* Root error */}
              {errors.root && (
                <div className="rounded-xl px-4 py-3 text-[13px] text-center" style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                }}>
                  {errors.root.message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => !isSubmitting && ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(34,197,94,0.55), inset 0 1px 0 rgba(255,255,255,0.2)")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)")}
              >
                {isSubmitting ? (
                  <><Spinner size="sm" className="text-white" /> Signing in…</>
                ) : (
                  <>Sign in <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            © {new Date().getFullYear()} Modufy · Restricted access
          </p>
        </div>
      </div>
    </div>
  );
}
