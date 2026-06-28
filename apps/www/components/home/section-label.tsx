import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.2em]",
        light ? "text-brand-tangerine" : "text-brand-leaf-green",
        className
      )}
    >
      {children}
    </p>
  );
}
