"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { PublicStorefront } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { portfolioForHero, productImage } from "./storefront-catalog";
import { sfEase, SfHeroItem, SfHeroStagger } from "./storefront-motion";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  badge?: string;
  image: string | null;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
};

function buildHeroSlides(sf: PublicStorefront, basePath: string): Slide[] {
  const headline = sf.hero_headline || sf.header_text || sf.business_name;
  const subheadline =
    sf.hero_subheadline ||
    sf.tagline ||
    (sf.city
      ? `Curated essentials for modern living — delivered across ${sf.city}.`
      : "Discover quality products crafted for you.");

  const shopCta = {
    label: sf.nav_shop_label || "Shop collection",
    href: `${basePath}/shop`,
  };
  const secondaryCta = { label: "View all products", href: `${basePath}/shop` };

  const heroPortfolio = portfolioForHero(sf);
  const portfolioSlides = heroPortfolio
    .map((img) => resolveMediaUrl(img.url))
    .filter(Boolean) as string[];

  if (portfolioSlides.length > 0) {
    return portfolioSlides.slice(0, 6).map((image, i) => {
      const caption = heroPortfolio[i]?.caption?.trim();
      const isMain = i === 0;

      return {
        id: `portfolio-${heroPortfolio[i].id}`,
        eyebrow: isMain ? sf.category || "Welcome" : "Collection",
        title: isMain ? headline : caption || sf.business_name,
        body: isMain
          ? subheadline
          : caption
            ? `Explore more from ${sf.business_name}.`
            : `A curated look from ${sf.business_name}.`,
        badge:
          isMain && sf.review_count > 0
            ? `⭐ ${sf.avg_rating.toFixed(1)}/5 from ${sf.review_count}+ reviews`
            : isMain && sf.promo_banner
              ? sf.promo_banner
              : undefined,
        image,
        cta: shopCta,
        secondary: isMain ? secondaryCta : undefined,
      };
    });
  }

  // No portfolio — gradient hero; product photo only as full-bleed fallback (never a side card)
  const fallbackImage = productImage(sf.products[0]) || null;

  return [
    {
      id: "main",
      eyebrow: sf.category || "Welcome",
      title: headline,
      body: subheadline,
      badge:
        sf.review_count > 0
          ? `⭐ ${sf.avg_rating.toFixed(1)}/5 from ${sf.review_count}+ reviews`
          : sf.promo_banner || undefined,
      image: fallbackImage,
      cta: shopCta,
      secondary: secondaryCta,
    },
  ];
}

export function StorefrontHomeHero({
  sf,
  accent,
  basePath,
}: {
  sf: PublicStorefront;
  accent: string;
  basePath: string;
}) {
  const slides = useMemo(() => buildHeroSlides(sf, basePath), [sf, basePath]);
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <section className="sf-pve-hero sf-hero-fullbleed" style={{ ["--sf-slide-accent" as string]: accent }}>
      <div className="sf-hero-fullbleed-stage">
        <AnimatePresence mode="wait">
          {slide.image ? (
            <motion.div
              key={slide.id}
              className="sf-hero-fullbleed-bg-wrap"
              initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.15, ease: sfEase }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.image} alt="" className="sf-hero-fullbleed-bg" />
            </motion.div>
          ) : (
            <motion.div
              key={slide.id}
              className="sf-hero-fullbleed-bg sf-hero-fullbleed-fallback"
              aria-hidden
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: sfEase }}
            />
          )}
        </AnimatePresence>
        <div className="sf-hero-fullbleed-shade" />

        <SfHeroStagger key={slide.id} className="sf-hero-fullbleed-content">
          <SfHeroItem index={0}>
            <span className="sf-hero-badge-pill" style={{ color: accent, background: `color-mix(in srgb, ${accent} 12%, #ffffff)` }}>
              <span className="sf-hero-badge-dot" style={{ background: accent }} />
              {slide.eyebrow}
            </span>
          </SfHeroItem>

          <SfHeroItem index={1}>
            <h1 className="sf-hero-title">{slide.title}</h1>
          </SfHeroItem>

          <SfHeroItem index={2}>
            <p className="sf-hero-description">{slide.body}</p>
          </SfHeroItem>

          {slide.badge ? (
            <SfHeroItem index={3}>
              <p className="sf-pve-hero-badge">
                {slide.badge.includes("⭐") ? null : <Star className="h-4 w-4 sf-star-filled" />}
                {slide.badge}
              </p>
            </SfHeroItem>
          ) : null}

          <SfHeroItem index={4}>
            <div className="sf-pve-hero-actions">
              <Link href={slide.cta.href} className="sf-btn sf-btn-solid sf-hero-btn-primary" style={{ background: accent }}>
                {slide.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {slide.secondary ? (
                <Link href={slide.secondary.href} className="sf-btn sf-btn-outline sf-hero-btn-secondary">
                  {slide.secondary.label}
                </Link>
              ) : null}
            </div>
          </SfHeroItem>
        </SfHeroStagger>

        {slides.length > 1 ? (
          <>
            <button type="button" className="sf-pve-hero-nav sf-pve-hero-nav-prev" onClick={prev} aria-label="Previous slide">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" className="sf-pve-hero-nav sf-pve-hero-nav-next" onClick={next} aria-label="Next slide">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="sf-pve-hero-dots">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={i === index ? "is-active" : ""}
                  style={i === index ? { background: accent } : undefined}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
