import { cn } from "@/lib/utils";

type DashboardPreviewProps = {
  className?: string;
  variant?: "hero" | "compact";
};

export function DashboardPreview({ className, variant = "hero" }: DashboardPreviewProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-brand-sea-grey/25",
        variant === "hero" ? "aspect-[4/3]" : "aspect-[5/4]",
        className
      )}
    >
      <div className="flex h-full">
        <aside className="hidden w-[24%] shrink-0 bg-[#273f22] p-3 text-white sm:block sm:p-4">
          <div className="h-8 w-8 rounded-lg bg-brand-tangerine" />
          <div className="mt-7 space-y-2">
            {["Dashboard", "Invoices", "Stock", "Bookings", "Reports"].map((item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-[10px] font-semibold",
                  index === 0 ? "bg-white text-brand-sea-grey" : "bg-white/6 text-white/55"
                )}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Live overview
              </p>
              <p className="mt-1 text-sm font-bold text-brand-sea-grey">July performance</p>
            </div>
            <div className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-brand-leaf-green">
              +18.4%
            </div>
          </div>

          <div className="flex-1 space-y-4 p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl bg-accent p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-brand-tangerine/80">Revenue</p>
                <p className="mt-2 text-lg font-black text-brand-sea-grey">$42k</p>
              </div>
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-brand-leaf-green/70">Leads</p>
                <p className="mt-2 text-lg font-black text-brand-sea-grey">1.2k</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-brand-sea-grey/45">Orders</p>
                <p className="mt-2 text-lg font-black text-brand-sea-grey">864</p>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-brand-sea-grey">Cash flow</p>
                <p className="text-[10px] font-semibold text-muted-foreground">7 day trend</p>
              </div>
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

            <div className="grid gap-2 sm:grid-cols-2">
              {["Invoice paid", "Low stock alert"].map((item, index) => (
                <div key={item} className="rounded-xl border border-border bg-[#f5f6f3] p-3">
                  <p className="text-xs font-bold text-brand-sea-grey">{item}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {index === 0 ? "Ava Studios, $1,280" : "12 products need restock"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
