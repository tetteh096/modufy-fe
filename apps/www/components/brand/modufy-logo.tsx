import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type ModufyLogoProps = {
  className?: string;
  showWordmark?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
  light?: boolean;
};

const sizes = {
  sm: { mark: 28, text: "text-lg" },
  md: { mark: 32, text: "text-xl" },
  lg: { mark: 36, text: "text-2xl" },
};

export function ModufyMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <rect width="32" height="32" rx="9" className="fill-brand-leaf-green" />
      <rect x="7" y="7" width="7" height="7" rx="2" className="fill-brand-tangerine" />
      <rect x="18" y="7" width="7" height="7" rx="2" className="fill-white/90" />
      <rect x="7" y="18" width="7" height="7" rx="2" className="fill-white/90" />
      <rect x="18" y="18" width="7" height="7" rx="2" className="fill-brand-tangerine" />
    </svg>
  );
}

export function ModufyLogo({
  className,
  showWordmark = true,
  href = "/",
  size = "md",
  light = false,
}: ModufyLogoProps) {
  const { mark, text } = sizes[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ModufyMark size={mark} />
      {showWordmark ? (
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            light ? "text-white" : "text-brand-sea-grey",
            text
          )}
        >
          {siteConfig.name}
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label={`${siteConfig.name} home`}>
      {content}
    </Link>
  );
}
