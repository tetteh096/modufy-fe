import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { aboutValues } from "@/lib/about-content";
import { homeImages } from "@/lib/home-images";

export function ValuesSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-xl sm:aspect-[5/4]">
              <Image
                src={homeImages.pages.values}
                alt="Modufy team collaborating at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-sea-grey/25 via-transparent to-brand-tangerine/15" />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl font-bold sm:text-4xl">What guides how we build</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Modufy exists so operators spend less time fighting their software and more time serving
              customers, managing stock, and closing the month with confidence.
            </p>

            <div className="mt-8 space-y-6">
              {aboutValues.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-leaf-green">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{value.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
