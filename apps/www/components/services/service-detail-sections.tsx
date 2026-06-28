import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { IntegrationsSection } from "@/components/home/integrations-section";
import type { ServiceItem } from "@/lib/services-content";
import { serviceReviews } from "@/lib/services-content";

type ServiceDetailContentProps = {
  service: ServiceItem;
};

export function ServiceDetailHero({ service }: ServiceDetailContentProps) {
  return (
    <section className="section-padding pb-10">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{service.heroTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {service.heroDescription}
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl">
          <Image
            src="/images/service/video-bg.png"
            alt={service.title}
            width={960}
            height={540}
            className="w-full object-cover"
          />
          <Link
            href="https://www.youtube.com/watch?v=SixdAQtWJQ8"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Play service video"
          >
            <Image src="/images/service/play-btn.svg" alt="" width={80} height={80} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

export function ServiceDetailBody({ service }: ServiceDetailContentProps) {
  return (
    <section className="section-padding border-t border-border pt-10">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <h2 className="text-3xl font-bold">{service.detailTitle}</h2>
            {service.detailParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-4 leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </FadeIn>
          <FadeIn delay={0.1} className="space-y-6">
            {service.highlights.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <Image src={item.icon} alt="" width={28} height={28} />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function ServiceReviewsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            We&apos;ve earned a 4.8-star Trustpilot rating
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {serviceReviews.map((review, index) => (
            <FadeIn key={review.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-1 text-emerald-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{review.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{review.author}</p>
                    <p className="text-sm text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-10 text-center">
          <Button href="/contact" variant="outline">
            View All Reviews
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

export function ServiceDetailIntegrations() {
  return <IntegrationsSection />;
}
