import type { ReactNode } from "react";
import { AuthBrand } from "@/components/features/auth/auth-brand";
import { AuthCopyright } from "@/components/features/auth/auth-soft-button";
import { cn } from "@/lib/utils";

type AuthCardShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** Boron-style CTA row below the form, e.g. “Don't have an account?” */
  altAction?: ReactNode;
  /** Boron-style alternate sign-in row, e.g. PIN / social icons */
  altMethods?: ReactNode;
  /** Extra content outside the card (legacy) */
  footer?: ReactNode;
  showCopyright?: boolean;
  className?: string;
};

export function AuthCardShell({
  title,
  description,
  children,
  altAction,
  altMethods,
  footer,
  showCopyright = true,
  className,
}: AuthCardShellProps) {
  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="auth-card">
        <AuthBrand />

        <div className="mb-5 space-y-1.5">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground leading-relaxed px-1">{description}</p>
          ) : null}
        </div>

        <div className="auth-card-form">{children}</div>

        {altAction ? <div className="mt-4">{altAction}</div> : null}

        {altMethods ? <div className="mt-5 pt-1">{altMethods}</div> : null}

        {showCopyright ? <AuthCopyright /> : null}
      </div>

      {footer ? <div className="mt-4 text-center">{footer}</div> : null}
    </div>
  );
}
