import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { servicesTestimonial } from "@/lib/services-content";

export function ServicesTestimonialBlock() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-site">
        <FadeIn className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">Integration with dozens of tools</h2>
          <Button href="/integrations" variant="outline">
            Browse all integrations
          </Button>
        </FadeIn>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <FadeIn className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/v3/video-bg.png"
              alt="Product demo"
              width={640}
              height={400}
              className="w-full object-cover"
            />
            <Link
              href="https://www.youtube.com/watch?v=SixdAQtWJQ8"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play demo video"
            >
              <Image
                src="/images/v3/play-btn.png"
                alt=""
                width={72}
                height={72}
                className="transition-transform hover:scale-110"
              />
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              &ldquo;{servicesTestimonial.quote}&rdquo;
            </p>
            <div className="mt-8 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{servicesTestimonial.author}</p>
                <p className="text-sm text-muted-foreground">{servicesTestimonial.role}</p>
              </div>
              <Image
                src={servicesTestimonial.logo}
                alt=""
                width={96}
                height={32}
                className="h-8 w-auto opacity-70"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
