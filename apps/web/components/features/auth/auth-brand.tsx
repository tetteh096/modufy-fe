import Link from "next/link";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthBrandProps = {
  className?: string;
};

/** Centered logo block — matches Boron auth-brand inside the card. */
export function AuthBrand({ className }: AuthBrandProps) {
  return (
    <Link
      href="/login"
      className={cn("auth-brand inline-flex items-center justify-center gap-2.5 mb-4 group", className)}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Building2 className="h-4 w-4" />
      </div>
      <span className="text-xl font-bold tracking-tight">BizOS</span>
    </Link>
  );
}
