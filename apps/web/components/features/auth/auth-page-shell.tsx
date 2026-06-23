import type { ReactNode } from "react";

type AuthPageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** Centered link row below the form, e.g. “Back to sign in”. */
  footer?: ReactNode;
};

/** Shared auth-portal page layout — title, description, form area, optional footer. */
export function AuthPageShell({ title, description, children, footer }: AuthPageShellProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="auth-page-title">{title}</h1>
        {description ? <p className="auth-page-description">{description}</p> : null}
      </header>

      {children}

      {footer ? <div className="auth-page-footer">{footer}</div> : null}
    </div>
  );
}
