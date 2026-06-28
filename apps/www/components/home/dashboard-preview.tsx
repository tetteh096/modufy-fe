import { cn } from "@/lib/utils";

type DashboardPreviewProps = {
  className?: string;
  variant?: "hero" | "compact";
};

export function DashboardPreview({ className, variant = "hero" }: DashboardPreviewProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-brand-sea-grey/10",
        variant === "hero" ? "aspect-[4/3]" : "aspect-[5/4]",
        className
      )}
    >
      <div className="flex h-full">
        <aside className="hidden w-[22%] shrink-0 bg-brand-leaf-green p-3 sm:block sm:p-4">
          <div className="h-3 w-3/4 rounded-full bg-white/90" />
          <div className="mt-6 space-y-2.5">
            <div className="h-2 w-full rounded-full bg-brand-tangerine" />
            <div className="h-2 w-4/5 rounded-full bg-white/35" />
            <div className="h-2 w-4/5 rounded-full bg-white/35" />
            <div className="h-2 w-4/5 rounded-full bg-white/35" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
            <div className="h-2.5 w-24 rounded-full bg-muted" />
            <div className="h-8 w-8 rounded-full bg-accent" />
          </div>

          <div className="flex-1 space-y-4 p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl bg-accent p-3">
                <div className="h-2 w-8 rounded-full bg-brand-tangerine/70" />
                <div className="mt-3 h-5 w-12 rounded-md bg-brand-tangerine" />
              </div>
              <div className="rounded-xl bg-secondary p-3">
                <div className="h-2 w-8 rounded-full bg-brand-leaf-green/50" />
                <div className="mt-3 h-5 w-12 rounded-md bg-brand-leaf-green" />
              </div>
              <div className="rounded-xl bg-muted p-3">
                <div className="h-2 w-8 rounded-full bg-brand-sea-grey/30" />
                <div className="mt-3 h-5 w-12 rounded-md bg-brand-sea-grey" />
              </div>
            </div>

            <div className="rounded-xl border border-border p-3 sm:p-4">
              <div className="flex h-28 items-end gap-2 sm:h-32">
                {[42, 68, 55, 82, 61, 74, 48].map((height, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 rounded-t-md",
                      index % 2 === 0 ? "bg-brand-tangerine" : "bg-brand-leaf-green"
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2.5 w-full rounded-full bg-muted" />
              <div className="h-2.5 w-5/6 rounded-full bg-muted" />
              <div className="h-2.5 w-2/3 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
