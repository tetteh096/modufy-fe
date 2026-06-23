import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
  isGuestOnlyPath,
  isProtectedPath,
  loginRedirectUrl,
} from "@/lib/auth-routes";

function hasSessionCookie(request: NextRequest): boolean {
  const cookie = getSessionCookie(request);
  if (cookie) return true;

  // Edge-runtime fallback when getSessionCookie cannot read chunked cookies.
  return request.cookies.getAll().some(
    (entry) =>
      entry.name === "better-auth.session_token" ||
      entry.name.startsWith("better-auth.session_token.")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = hasSessionCookie(request);

  if (isProtectedPath(pathname) && !session) {
    return NextResponse.redirect(loginRedirectUrl(request.nextUrl, pathname));
  }

  if (isGuestOnlyPath(pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/onboarding",
    "/join",
    "/admin/:path*",
    "/login",
    "/register",
    "/login-pin",
    "/forgot-password",
    "/recover-password",
    "/deactivate",
    "/account-deactivation",
  ],
};
