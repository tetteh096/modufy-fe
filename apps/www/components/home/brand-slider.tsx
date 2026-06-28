import { brandLogos } from "@/lib/content";

export function BrandSlider() {
  const logos = [...brandLogos, ...brandLogos];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-[#fbf9f4] py-5">
      <div className="texture-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-site relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-sea-grey/40">
          Trusted worldwide
        </p>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee flex w-max items-center gap-6">
            {logos.map((logo, index) => (
              <span
                key={`${logo}-${index}`}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-brand-sea-grey/10 bg-white/45 px-5 py-2 font-display text-sm font-semibold tracking-wider text-brand-sea-grey/65 shadow-[0_2px_8px_rgba(54,54,54,0.02)] backdrop-blur-[2px] transition-all duration-300 hover:border-brand-tangerine/35 hover:bg-white hover:text-brand-sea-grey/90"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-tangerine/60" />
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

