"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import type { PublicService } from "@/types/api";
import { useStorefront } from "./storefront-context";
import { serviceGalleryImages } from "./storefront-service-media";
import { formatDuration, servicePriceLabel, storefrontBookUrl } from "./storefront-utils";
import { SfReveal } from "./storefront-motion";

export function StorefrontServiceDetail({ service }: { service: PublicService }) {
  const { accent, basePath } = useStorefront();
  const images = serviceGalleryImages(service);
  const [imageIndex, setImageIndex] = useState(0);
  const displayImg = images[imageIndex] ?? null;

  const perks = [
    service.is_bookable ? "Book online in a few taps" : null,
    service.duration_mins > 0 ? `${formatDuration(service.duration_mins)} session` : null,
    service.pricing_type === "hourly" ? "Hourly pricing" : "Fixed price",
  ].filter(Boolean) as string[];

  return (
    <div className="sf-svc-detail">
      <SfReveal className="sf-svc-detail-gallery" variant="scale" amount={0.12}>
        <div className="sf-svc-detail-main">
          {displayImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayImg} alt={service.name} className="sf-svc-detail-img" />
          ) : (
            <div className="sf-svc-detail-placeholder">
              <Sparkles className="h-12 w-12" />
            </div>
          )}
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="sf-svc-detail-nav prev"
                aria-label="Previous image"
                onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="sf-svc-detail-nav next"
                aria-label="Next image"
                onClick={() => setImageIndex((i) => (i + 1) % images.length)}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="sf-svc-detail-thumbs">
            {images.map((url, i) => (
              <button
                key={url}
                type="button"
                className={i === imageIndex ? "is-active" : ""}
                onClick={() => setImageIndex(i)}
                aria-label={`Image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
              </button>
            ))}
          </div>
        ) : null}
      </SfReveal>

      <SfReveal className="sf-svc-detail-copy" variant="up" delay={0.08}>
        {service.category ? <p className="sf-svc-detail-kicker">{service.category}</p> : null}
        <h1 className="sf-svc-detail-title">{service.name}</h1>

        <div className="sf-svc-detail-price-row">
          <span className="sf-svc-detail-price" style={{ color: accent }}>
            {servicePriceLabel(service)}
          </span>
          {service.duration_mins > 0 ? (
            <span className="sf-svc-detail-duration">
              <Clock className="h-4 w-4" />
              {formatDuration(service.duration_mins)}
            </span>
          ) : null}
        </div>

        {service.description ? (
          <div className="sf-svc-detail-desc">
            <h2>About this service</h2>
            <p>{service.description}</p>
          </div>
        ) : null}

        {perks.length > 0 ? (
          <ul className="sf-svc-detail-perks">
            {perks.map((p) => (
              <li key={p}>
                <Check className="h-4 w-4" style={{ color: accent }} />
                {p}
              </li>
            ))}
          </ul>
        ) : null}

        {(service.tags ?? []).length > 0 ? (
          <div className="sf-svc-detail-tags">
            {(service.tags ?? []).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        ) : null}

        <div className="sf-svc-detail-actions">
          {service.is_bookable ? (
            <Link
              href={storefrontBookUrl(basePath, service.id)}
              className="sf-btn sf-btn-solid sf-svc-detail-book"
              style={{ background: accent }}
            >
              <CalendarDays className="h-4 w-4" />
              Book appointment
            </Link>
          ) : (
            <Link href={`${basePath}/contact`} className="sf-btn sf-btn-outline">
              Contact us to book
            </Link>
          )}
        </div>
      </SfReveal>
    </div>
  );
}
