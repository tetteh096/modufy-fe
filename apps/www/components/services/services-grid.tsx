import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { services } from "@/lib/services-content";

export function ServicesGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => (
        <FadeIn key={service.slug} delay={index * 0.04}>
          <article className="group flex h-full gap-4 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
              <Image src={service.icon} alt="" width={28} height={28} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-leaf-green transition group-hover:gap-2.5"
              >
                Read more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
