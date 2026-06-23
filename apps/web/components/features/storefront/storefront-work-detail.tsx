"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MessageCircle } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import type { PublicStorefront, PublicWorkProjectDetail } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { buildWhatsAppUrl } from "@/lib/whatsapp-url";
import { activeServices } from "./storefront-catalog";

export function StorefrontWorkDetail({
  sf,
  project,
  basePath,
  accent,
}: {
  sf: PublicStorefront;
  project: PublicWorkProjectDetail;
  basePath: string;
  accent: string;
}) {
  const workLabel = sf.nav_work_label || "Portfolio";
  const services = activeServices(sf);
  const showServices = sf.show_services && services.length > 0;
  const whatsappPhone = sf.whatsapp?.trim();
  const whatsappHref =
    sf.show_whatsapp && whatsappPhone
      ? buildWhatsAppUrl(
          whatsappPhone,
          `Hi ${sf.business_name}, I saw your project "${project.title}" and I'd like to discuss something similar.`,
        )
      : "";

  const gallery = project.images.filter((img) => img.url !== project.cover_url);

  const slides = [
    ...(project.cover_url
      ? [{ src: resolveMediaUrl(project.cover_url), description: project.title }]
      : []),
    ...gallery.map((img) => ({
      src: resolveMediaUrl(img.url),
      description: img.caption || undefined,
    })),
  ];
  const galleryOffset = project.cover_url ? 1 : 0;

  const [lightboxIndex, setLightboxIndex] = useState(-1);

  return (
    <div className="sf-work-detail">
      {/* Immersive hero: cover photo with title plaque */}
      {project.cover_url ? (
        <header className="sf-work-detail-hero">
          <button
            type="button"
            className="sf-work-detail-hero-media"
            onClick={() => setLightboxIndex(0)}
            aria-label="View cover photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resolveMediaUrl(project.cover_url)} alt={project.title} />
          </button>
          <div className="sf-work-panel sf-work-detail-plaque">
            <p className="sf-work-panel-eyebrow">
              <span className="sf-work-panel-line" style={{ background: accent }} aria-hidden />
              {workLabel}
            </p>
            <h1 className="sf-work-panel-title">{project.title}</h1>
          </div>
        </header>
      ) : (
        <header className="sf-work-detail-heading">
          <p className="sf-work-detail-eyebrow">
            <span className="sf-work-panel-line" style={{ background: accent }} aria-hidden />
            {workLabel}
          </p>
          <h1>{project.title}</h1>
        </header>
      )}

      {project.description ? (
        <section className="sf-work-detail-story">
          <p className="sf-work-detail-description">{project.description}</p>
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section className="sf-work-detail-gallery" aria-label="Project gallery">
          <div className="sf-work-detail-gallery-masonry">
            {gallery.map((img, i) => (
              <button
                key={img.id}
                type="button"
                className="sf-work-detail-gallery-item"
                onClick={() => setLightboxIndex(galleryOffset + i)}
                aria-label={img.caption || `View photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveMediaUrl(img.url)} alt={img.caption || project.title} loading="lazy" />
                {img.caption ? (
                  <span className="sf-work-detail-gallery-caption">{img.caption}</span>
                ) : null}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Enquiry band */}
      <section className="sf-work-detail-band">
        <div className="sf-work-detail-band-inner">
          <div>
            <p className="sf-work-panel-eyebrow">
              <span className="sf-work-panel-line" style={{ background: accent }} aria-hidden />
              Enquire
            </p>
            <h2 className="sf-work-detail-band-title">
              Interested in something like this?
            </h2>
            <p className="sf-work-detail-band-copy">
              Reach out to {sf.business_name} to book or discuss your own project.
            </p>
          </div>
          <div className="sf-work-detail-band-actions">
            <Link href={`${basePath}/contact`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
              <MessageCircle className="h-4 w-4" />
              Contact us
            </Link>
            {showServices ? (
              <Link
                href={`${basePath}/services`}
                className="sf-btn sf-btn-outline sf-work-detail-band-outline"
              >
                <Calendar className="h-4 w-4" />
                Book a service
              </Link>
            ) : null}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="sf-btn sf-btn-outline sf-work-detail-wa"
              >
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="sf-work-detail-back">
        <Link href={`${basePath}/work`} className="storefront-section-link" style={{ color: accent }}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to {workLabel}
        </Link>
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={Math.max(lightboxIndex, 0)}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Zoom, Captions, Counter]}
        carousel={{ finite: false }}
        zoom={{ maxZoomPixelRatio: 3 }}
        styles={{ container: { backgroundColor: "rgb(8 8 10 / 0.96)" } }}
      />
    </div>
  );
}
