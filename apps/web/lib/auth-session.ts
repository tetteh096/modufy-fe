import { authClient } from "@/lib/auth-client";
import { useAuthStore, type BranchOption } from "@/store/auth";

export type TokenResponse = {
  token?: string;
  onboarding_required?: boolean;
  business_id?: string;
  requires_branch_selection?: boolean;
  branches?: BranchOption[];
  active_branch_id?: string;
  active_branch_name?: string;
};

/** Exchange Better Auth session for Go API JWT and persist in Zustand. */
export async function syncAuthToken(branchId?: string): Promise<TokenResponse | null> {
  const url = branchId
    ? `/api/auth/token?branch_id=${encodeURIComponent(branchId)}`
    : "/api/auth/token";
  const res = await fetch(url);
  if (!res.ok) return null;

  const body = (await res.json()) as TokenResponse;
  const session = await authClient.getSession();
  const user = session?.data?.user;

  if (!user) return body;

  if (body.requires_branch_selection) {
    useAuthStore.getState().clearAuth();
    return body;
  }

  if (body.token) {
    useAuthStore.getState().setAuth(
      body.token,
      { id: user.id, email: user.email, name: user.name },
      body.business_id ?? "",
      body.active_branch_id
        ? { id: body.active_branch_id, name: body.active_branch_name ?? "Branch" }
        : undefined,
      body.branches ?? [],
    );
  }

  return body;
}

export async function selectBranch(branchId: string): Promise<boolean> {
  const res = await fetch("/api/auth/select-branch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch_id: branchId }),
  });
  if (!res.ok) return false;

  const body = (await res.json()) as TokenResponse;
  const session = await authClient.getSession();
  const user = session?.data?.user;
  if (!body.token || !user) return false;

  useAuthStore.getState().setAuth(
    body.token,
    { id: user.id, email: user.email, name: user.name },
    body.business_id ?? "",
    { id: body.active_branch_id!, name: body.active_branch_name ?? "Branch" },
  );
  return true;
}

export function resolvePostAuthPath(
  onboardingRequired: boolean | undefined,
  requiresBranchSelection: boolean | undefined,
  next: string | null,
): string {
  if (requiresBranchSelection) return "/select-branch";
  // Never let a stale `next=/dashboard` bypass required business creation.
  if (onboardingRequired) return "/onboarding";
  if (next && next.startsWith("/")) return next;
  return "/dashboard";
}
