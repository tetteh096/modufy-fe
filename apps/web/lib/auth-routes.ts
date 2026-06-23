/** Route groups for auth middleware (cookie-based optimistic checks). */

export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/settings",
  "/onboarding",
  "/join",
  "/admin",
  "/deactivate",
  "/account-deactivation",
] as const;

/** Auth pages that should redirect to the app when a session cookie exists. */
export const GUEST_ONLY_PREFIXES = [
  "/login",
  "/register",
  "/login-pin",
  "/forgot-password",
  "/recover-password",
] as const;

export function pathStartsWith(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isProtectedPath(pathname: string): boolean {
  return pathStartsWith(pathname, PROTECTED_PREFIXES);
}

export function isGuestOnlyPath(pathname: string): boolean {
  return pathStartsWith(pathname, GUEST_ONLY_PREFIXES);
}

export function loginRedirectUrl(requestUrl: URL, nextPath?: string): URL {
  const url = new URL("/login", requestUrl.origin);
  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    url.searchParams.set("next", nextPath);
  }
  return url;
}
