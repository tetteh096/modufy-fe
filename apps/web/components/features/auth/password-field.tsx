"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  id: string;
  label?: string;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  withIcon?: boolean;
  inputClassName?: string;
  registration: ComponentProps<typeof Input>;
};

export function PasswordField({
  id,
  label,
  error,
  autoComplete = "current-password",
  placeholder = "••••••••",
  withIcon = false,
  inputClassName,
  registration,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={cn(label ? "space-y-1.5" : "space-y-0")}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div className="relative">
        {withIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </span>
        ) : null}
        <Input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn("pr-10 h-10", withIcon && "pl-10", error && "border-destructive", inputClassName)}
          {...registration}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full w-10 hover:bg-transparent text-muted-foreground"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive mt-1.5">{error}</p> : null}
    </div>
  );
}
