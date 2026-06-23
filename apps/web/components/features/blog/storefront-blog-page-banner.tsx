"use client";

import Link from "next/link";
import { ChevronRight, Clock3, MapPin, Phone } from "lucide-react";
import { resolveBlogCoverSrc } from "@/lib/blog-cover";
import { resolveMediaUrl } from "@/lib/media-url";
import { useStorefront } from "@/components/features/storefront/storefront-context";

export function StorefrontBlogPageBanner({
  title,
  description,
  eyebrow = "Articles & insights",
  coverSeed,
  featuredImageUrl,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  coverSeed?: string;
  featuredImageUrl?: string;
}) {
  const { sf, basePath, accent } = useStorefront();
  if (!sf) return null;

  const bg =
    coverSeed || featuredImageUrl
      ? resolveMediaUrl(resolveBlogCoverSrc(featuredImageUrl, coverSeed || "blog"))
      : null;

  const locationParts = [sf.area, sf.city, sf.country].filter(Boolean);
  const locationLabel = locationParts.length > 0 ? locationParts.join(" · ") : sf.business_name;
  const headline = sf.tagline || sf.category || "Trusted local business";
  const phone = sf.show_phone && sf.phone ? sf.phone : null;

  return (
    <section
      className={`sf-blog-page-banner${bg ? " sf-blog-page-banner--image" : " sf-blog-page-banner--light"}`}
      style={{
        ["--sf-blog-banner-accent" as string]: accent,
        ...(bg ? { backgroundImage: `url(${bg})` } : {}),
      }}
    >
      {bg ? <div className="sf-blog-page-banner-overlay" aria-hidden /> : null}
      <div className="sf-blog-page-banner-inner">
        <div className="sf-blog-page-banner-grid">
          <div className="sf-blog-page-banner-copy">
            <span className="sf-blog-page-banner-eyebrow">
              <span className="sf-blog-page-banner-dot" aria-hidden />
              {eyebrow}
            </span>
            <h1>{title}</h1>
            <p className="sf-blog-page-banner-desc">{description}</p>
            <nav className="sf-blog-page-banner-crumbs" aria-label="Breadcrumb">
              <Link href={basePath}>Home</Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <span>Blog</span>
            </nav>
          </div>

          <aside className="sf-blog-page-banner-info" aria-label="Business information">
            <div className="sf-blog-page-banner-info-row">
              <Clock3 className="sf-blog-page-banner-info-icon sf-blog-page-banner-info-icon--blue" />
              <div>
                <span className="sf-blog-page-banner-info-label">{sf.business_name}</span>
                <p>{headline}</p>
              </div>
            </div>
            <div className="sf-blog-page-banner-info-row">
              <MapPin className="sf-blog-page-banner-info-icon sf-blog-page-banner-info-icon--green" />
              <div>
                <span className="sf-blog-page-banner-info-label">Location</span>
                <p>{locationLabel}</p>
              </div>
            </div>
            {phone ? (
              <div className="sf-blog-page-banner-info-row sf-blog-page-banner-info-row--last">
                <Phone className="sf-blog-page-banner-info-icon sf-blog-page-banner-info-icon--blue" />
                <div>
                  <span className="sf-blog-page-banner-info-label">Quick contact</span>
                  <p>
                    <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                  </p>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
