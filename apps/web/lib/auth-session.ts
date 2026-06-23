import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth";

type TokenResponse = {
  token: string;
  onboarding_required?: boolean;
  business_id?: string;
};

/** Exchange Better Auth session for Go API JWT and persist in Zustand. */
export async function syncAuthToken(): Promise<TokenResponse | null> {
  const res = await fetch("/api/auth/token");
  if (!res.ok) return null;

  const body = (await res.json()) as TokenResponse;
  const session = await authClient.getSession();
  const user = session?.data?.user;

  if (user && body.token) {
    useAuthStore.getState().setAuth(
      body.token,
      { id: user.id, email: user.email, name: user.name },
      body.business_id ?? ""
    );
  }

  return body;
}

export function resolvePostAuthPath(
  onboardingRequired: boolean | undefined,
  next: string | null
): string {
  if (onboardingRequired && !next) return "/onboarding";
  if (next && next.startsWith("/")) return next;
  return "/dashboard";
}
