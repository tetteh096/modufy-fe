import { cn } from "@/lib/utils";

type GlassPillProps = {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
};

export function GlassPill({ children, className, dark = false }: GlassPillProps) {
  return (
    <div
      className={cn(
        "relative overflow-visible rounded-full border backdrop-blur-2xl backdrop-saturate-150",
        "transition-[background-color,border-color,box-shadow,color] duration-300 ease-out",
        dark
          ? "border-white/15 bg-brand-sea-grey/75 text-white shadow-black/20"
          : "border-white/70 bg-white/80 shadow-[0_8px_32px_rgba(54,54,54,0.08)] shadow-brand-sea-grey/5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GlassPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-visible rounded-[1.75rem]",
        "border border-white/90 bg-white/82 backdrop-blur-3xl backdrop-saturate-150",
        "shadow-[0_28px_80px_rgba(54,54,54,0.2),inset_0_1px_0_rgba(255,255,255,0.95)]",
        "ring-1 ring-white/80",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white/75 via-white/45 to-white/25"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
