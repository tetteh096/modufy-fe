"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/shared/spinner";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth";
import { useLockStore } from "@/store/lock";

export default function LogoutPage() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const unlock = useLockStore((s) => s.unlock);

  useEffect(() => {
    let active = true;

    async function run() {
      await authClient.signOut();
      clearAuth();
      unlock();
      if (active) router.replace("/login");
    }

    void run();
    return () => {
      active = false;
    };
  }, [clearAuth, router, unlock]);

  return (
    <AuthPageShell title="Signing out" description="Ending your session securely">
      <div className="auth-status-block">
        <Spinner className="h-8 w-8" />
        <p className="auth-text-muted">Redirecting to sign in…</p>
        <Link href="/login" className="auth-link text-sm">
          Go now
        </Link>
      </div>
    </AuthPageShell>
  );
}
