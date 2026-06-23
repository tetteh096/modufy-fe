import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
    </div>
  );
}

export function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <Spinner size="lg" />
    </div>
  );
}
