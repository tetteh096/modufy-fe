import type { ReactNode } from "react";
import { AuthBoxReveal } from "@/components/features/auth/auth-motion";

type AuthPageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Shared auth-portal page layout — title, description, form area, optional footer. */
export function AuthPageShell({ title, description, children, footer }: AuthPageShellProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <AuthBoxReveal>
          <h1 className="auth-page-title">{title}</h1>
        </AuthBoxReveal>
        {description ? (
          <AuthBoxReveal delay={0.06}>
            <p className="auth-page-description">{description}</p>
          </AuthBoxReveal>
        ) : null}
      </header>

      <div className="auth-form-stack">{children}</div>

      {footer ? (
        <AuthBoxReveal delay={0.2}>
          <div className="auth-page-footer">{footer}</div>
        </AuthBoxReveal>
      ) : null}
    </div>
  );
}
