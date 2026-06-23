import type { Metadata } from "next";
import { AuthBrandPanel, AuthMobileStrip } from "@/components/features/auth/auth-brand-panel";
import "./auth-portal.css";

export const metadata: Metadata = {
  title: { default: "Sign in", template: "%s | BizOS" },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-portal flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="auth-shell flex w-full max-w-[1060px] flex-col overflow-hidden rounded-3xl lg:min-h-[640px] lg:flex-row">
        <AuthMobileStrip />
        <AuthBrandPanel />

        <main className="auth-form-wrap flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14">
          <div className="mx-auto w-full max-w-[400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
