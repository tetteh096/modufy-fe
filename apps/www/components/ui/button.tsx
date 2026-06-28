import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  external?: boolean;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-105",
  secondary:
    "bg-brand-leaf-green text-white shadow-lg shadow-brand-leaf-green/20 hover:brightness-110",
  ghost: "text-foreground hover:bg-muted",
  outline: "border border-border bg-card text-foreground hover:border-brand-leaf-green hover:text-brand-leaf-green",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200",
    variants[variant],
    sizes[size],
    className
  );

  if (!href) {
    return <span className={classes}>{children}</span>;
  }

  if (external || href.startsWith("http")) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
