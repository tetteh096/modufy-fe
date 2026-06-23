"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthFieldProps = {
  id: string;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthField({ id, label, error, className, ...props }: AuthFieldProps) {
  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-field-label">
        {label}
      </label>
      <input
        id={id}
        className={cn("auth-field-input", error && "auth-field-input--error", className)}
        {...props}
      />
      {error ? <p className="auth-field-error">{error}</p> : null}
    </div>
  );
}

type AuthPasswordFieldProps = {
  id: string;
  label: string;
  error?: string;
  registration: InputHTMLAttributes<HTMLInputElement>;
};

export function AuthPasswordField({ id, label, error, registration }: AuthPasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-field-label">
        {label}
      </label>
      <div className="auth-password-wrap">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={cn("auth-field-input pr-11", error && "auth-field-input--error")}
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
  );
}
