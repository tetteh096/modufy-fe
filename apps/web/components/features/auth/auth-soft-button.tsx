import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthSoftButtonProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: "primary" | "accent" | "muted";
};

const variantClass = {
  primary: "bg-primary/12 text-primary hover:bg-primary/18",
  accent: "bg-accent/35 text-accent-foreground hover:bg-accent/45",
  muted: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
};

export function AuthSoftButton({
  href,
  icon: Icon,
  label,
  variant = "primary",
}: AuthSoftButtonProps) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className={cn(
        "auth-soft-btn",
        variantClass[variant]
      )}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

export function AuthCopyright() {
  return (
    <p className="mt-auto pt-6 mb-0 text-xs text-muted-foreground">
      © {new Date().getFullYear()} Modufy ·{" "}
      <span className="font-semibold underline underline-offset-2 decoration-muted-foreground/40">
        Business OS
      </span>
    </p>
  );
}
