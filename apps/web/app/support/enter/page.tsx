"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { publicApi, accountApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useImpersonationStore } from "@/store/impersonation";
import { PageLoader } from "@/components/shared/page-loader";

function SupportEnterContent() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setSession = useImpersonationStore((s) => s.setSession);

  useEffect(() => {
    if (!code) {
      setError("Missing support code");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await publicApi.exchangeSupportCode(code);
        useAuthStore.setState({ token: res.token, isAuthenticated: true });
        const profile = await accountApi.getProfile();
        if (cancelled) return;
        setAuth(
          res.token,
          { id: profile.id, email: profile.email, name: profile.name },
          res.session.business_id,
        );
        setSession(res.session.session_id, res.session.scope);
        router.replace("/");
      } catch {
        if (!cancelled) setError("Invalid or expired code. Request a new session from admin.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, router, setAuth, setSession]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-sm text-destructive text-center max-w-sm">{error}</p>
      </div>
    );
  }

  return <PageLoader />;
}

export default function SupportEnterPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SupportEnterContent />
    </Suspense>
  );
}
