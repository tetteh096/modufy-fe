import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

export type PageHeroBreadcrumb = {
  label: string;
  href?: string;
};

export type PageHeroProps = {
  title: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  breadcrumbs?: PageHeroBreadcrumb[];
  tags?: readonly string[];
  children?: ReactNode;
  titleClassName?: string;
};

export function PageHero({
  title,
  eyebrow,
  subtitle,
  image,
  imageAlt = "",
  breadcrumbs = [{ label: "Home", href: "/" }],
  tags,
  children,
  titleClassName,
}: PageHeroProps) {
  const crumbs =
    breadcrumbs.length > 0 && breadcrumbs[breadcrumbs.length - 1]?.label !== title
      ? [...breadcrumbs, { label: typeof title === "string" ? title : eyebrow ?? "Page" }]
      : breadcrumbs;

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-brand-sea-grey pb-14 pt-32 sm:-mt-[6.25rem] sm:pb-16 sm:pt-36">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover opacity-40"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-sea-grey/75 via-brand-sea-grey/88 to-brand-sea-grey" />
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-25" aria-hidden />

      <div className="container-site relative">
        <FadeIn>
          {crumbs.length > 0 ? (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-white/50">
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1;
                  return (
                    <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                      {index > 0 ? <ChevronRight className="h-3.5 w-3.5 opacity-60" /> : null}
                      {crumb.href && !isLast ? (
                        <Link href={crumb.href} className="transition hover:text-white">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className={isLast ? "text-white/90" : undefined}>{crumb.label}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : null}

          {eyebrow ? (
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-brand-tangerine">
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              eyebrow ? "mt-3" : crumbs.length > 0 ? "mt-8" : "mt-0",
              "max-w-3xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-[3.25rem]",
              titleClassName
            )}
          >
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">{subtitle}</p>
          ) : null}

          {tags && tags.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {children}
        </FadeIn>
      </div>
    </section>
  );
}
