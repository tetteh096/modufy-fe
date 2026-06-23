"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { syncAuthToken } from "@/lib/auth-session";
import { useAuthStore } from "@/store/auth";
import { PageLoader } from "@/components/shared/page-loader";

/**
 * Gates authenticated content until the Go API JWT has been synced from the
 * Better Auth session. Without this, the dashboard's eager queries mount and
 * fire before the token lands in the store — every request 401s and the axios
 * response interceptor bounces the user to /login on an otherwise valid load.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      await syncAuthToken();
      if (!active) return;

      // No token means no valid session — send to login, preserving where the
      // user was so they return there after signing in.
      if (!useAuthStore.getState().token) {
        const here =
          typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "";
        const next =
          here && here !== "/" ? `?next=${encodeURIComponent(here)}` : "";
        router.replace(`/login${next}`);
        return;
      }

      setReady(true);
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) return <PageLoader />;
  return <>{children}</>;
}
