"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useStorefront } from "./storefront-context";
import { SfHeroItem, SfHeroStagger } from "./storefront-motion";

export function StorefrontTextHero({
  watermark,
  eyebrow,
  title,
  description,
  accent,
  crumbs,
  meta,
}: {
  watermark: string;
  eyebrow?: string;
  title: string;
  description?: string;
  accent: string;
  crumbs?: { label: string; href?: string }[];
  meta?: React.ReactNode;
}) {
  const { basePath } = useStorefront();

  return (
    <section className="sf-text-hero" style={{ ["--sf-hero-accent" as string]: accent }}>
      <span className="sf-text-hero-watermark" aria-hidden>
        {watermark}
      </span>
      <SfHeroStagger className="sf-text-hero-inner">
        {crumbs && crumbs.length > 0 ? (
          <SfHeroItem index={0}>
            <nav className="sf-text-hero-crumbs" aria-label="Breadcrumb">
              <Link href={basePath}>Home</Link>
              {crumbs.map((c, i) => (
                <span key={`${c.label}-${i}`} className="sf-text-hero-crumb">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                </span>
              ))}
            </nav>
          </SfHeroItem>
        ) : null}
        {eyebrow ? (
          <SfHeroItem index={1}>
            <p className="sf-text-hero-eyebrow">{eyebrow}</p>
          </SfHeroItem>
        ) : null}
        <SfHeroItem index={2}>
          <h1 className="sf-text-hero-title">{title}</h1>
        </SfHeroItem>
        {description ? (
          <SfHeroItem index={3}>
            <p className="sf-text-hero-desc">{description}</p>
          </SfHeroItem>
        ) : null}
        {meta ? (
          <SfHeroItem index={4}>
            <div className="sf-text-hero-meta">{meta}</div>
          </SfHeroItem>
        ) : null}
      </SfHeroStagger>
    </section>
  );
}
