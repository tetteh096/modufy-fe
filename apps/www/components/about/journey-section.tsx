import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { aboutJourneyCopy, journeyGallery } from "@/lib/about-content";

export function JourneySection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <FadeIn className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-bold sm:text-4xl">{aboutJourneyCopy.title}</h2>
          </div>
          <div className="flex items-center lg:col-span-5">
            <p className="text-base leading-relaxed text-muted-foreground">
              {aboutJourneyCopy.description}
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {journeyGallery.map((column, columnIndex) => (
            <FadeIn key={columnIndex} delay={columnIndex * 0.08} className="space-y-4">
              {column.map((image, imageIndex) => (
                <div
                  key={`${image.src}-${imageIndex}`}
                  className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
