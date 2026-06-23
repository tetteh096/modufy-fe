"use client";

import Link from "next/link";
import type { PublicWorkProjectSummary } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";

type HeroSlide = { id: string; image: string };

export function StorefrontWorkHero({
  projects,
  basePath,
}: {
  projects: PublicWorkProjectSummary[];
  basePath: string;
}) {
  // Every photo the author starred becomes a slide; if nothing is starred yet,
  // fall back to project covers so the strip is never empty.
  const starred: HeroSlide[] = projects.flatMap((p) =>
    (p.hero_urls ?? []).map((url) => ({ id: p.id, image: url })),
  );
  const slides: HeroSlide[] = (
    starred.length > 0
      ? starred
      : projects
          .filter((p) => p.cover_url)
          .map((p) => ({ id: p.id, image: p.cover_url }))
  ).slice(0, 12);

  if (slides.length === 0) return null;

  // Repeat the set until the strip is wide enough that no empty space is ever
  // visible, then duplicate it once more for a seamless -50% loop.
  const base: HeroSlide[] = [];
  while (base.length < 6) base.push(...slides);
  const loop = [...base, ...base];
  const duration = Math.max(base.length * 30, 90);

  return (
    <section className="sf-work-hero" aria-label="Portfolio showcase">
      <div className="sf-work-hero-ticker">
        <div className="sf-work-hero-track" style={{ animationDuration: `${duration}s` }}>
          {loop.map((slide, i) => (
            <Link
              key={`${slide.id}-${i}`}
              href={`${basePath}/work/${slide.id}`}
              className="sf-work-hero-slide"
              tabIndex={i >= base.length ? -1 : undefined}
              aria-hidden={i >= base.length}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaUrl(slide.image)}
                alt=""
                loading={i < 2 ? "eager" : "lazy"}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
