import { cn } from "@/lib/utils";

export function SettingsStickyFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 mt-8 flex flex-wrap justify-end gap-3 rounded-xl border border-border/80 bg-background/95 px-5 py-4 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.12)] backdrop-blur-sm supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      {children}
    </div>
  );
}
