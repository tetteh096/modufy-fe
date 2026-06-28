"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthBoxReveal } from "@/components/features/auth/auth-motion";

function authInputClass(hasError?: boolean, className?: string) {
  return cn("auth-field-input", hasError && "auth-field-input--error", className);
}

type AuthFieldProps = {
  id: string;
  label: string;
  error?: string;
  revealDelay?: number;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthField({
  id,
  label,
  error,
  className,
  revealDelay = 0,
  ...props
}: AuthFieldProps) {
  return (
    <AuthBoxReveal delay={revealDelay} className="w-full">
      <div className="auth-field">
        <label htmlFor={id} className="auth-field-label">
          {label}
        </label>
        <input
          id={id}
          className={authInputClass(!!error, className)}
          {...props}
        />
        {error ? <p className="auth-field-error">{error}</p> : null}
      </div>
    </AuthBoxReveal>
  );
}

type AuthPasswordFieldProps = {
  id: string;
  label: string;
  error?: string;
  revealDelay?: number;
  labelAction?: ReactNode;
  registration: InputHTMLAttributes<HTMLInputElement>;
};

export function AuthPasswordField({
  id,
  label,
  error,
  registration,
  revealDelay = 0,
  labelAction,
}: AuthPasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <AuthBoxReveal delay={revealDelay} className="w-full">
      <div className="auth-field">
        <div className="auth-field-label-row">
          <label htmlFor={id} className="auth-field-label">
            {label}
          </label>
          {labelAction}
        </div>
        <div className="auth-password-wrap">
          <input
            id={id}
            type={show ? "text" : "password"}
            className={authInputClass(!!error, "pr-11")}
            {...registration}
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error ? <p className="auth-field-error">{error}</p> : null}
      </div>
    </AuthBoxReveal>
  );
}

/** Wrap primary actions (submit, alerts) with the same reveal motion. */
export function AuthFormReveal({
  children,
  delay = 0.2,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <AuthBoxReveal delay={delay} className={cn("w-full", className)}>
      {children}
    </AuthBoxReveal>
  );
}
