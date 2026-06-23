"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Sparkles } from "lucide-react";
import type { PublicService } from "@/types/api";
import { useStorefront } from "./storefront-context";
import { serviceCoverImage } from "./storefront-service-media";
import { formatDuration, servicePriceLabel, storefrontBookUrl } from "./storefront-utils";

export function StorefrontServiceCard({
  service,
  accent,
}: {
  service: PublicService;
  accent: string;
}) {
  const { basePath } = useStorefront();
  const href = `${basePath}/services/${service.id}`;
  const cover = serviceCoverImage(service);
  const categoryLabel = service.category || (service.tags ?? [])[0] || "";

  return (
    <article className="sf-svc-card">
      <Link href={href} className="sf-svc-card-media">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={service.name} className="sf-svc-card-img" />
        ) : (
          <div className="sf-svc-card-placeholder">
            <Sparkles className="h-10 w-10" />
          </div>
        )}
        {service.is_bookable ? (
          <span className="sf-svc-card-badge" style={{ background: accent }}>
            Bookable
          </span>
        ) : null}
      </Link>

      <div className="sf-svc-card-body">
        {categoryLabel ? <p className="sf-svc-card-kicker">{categoryLabel}</p> : null}
        <Link href={href} className="sf-svc-card-title">
          {service.name}
        </Link>
        {service.description ? <p className="sf-svc-card-desc">{service.description}</p> : null}

        <div className="sf-svc-card-meta">
          <span className="sf-svc-card-price" style={{ color: accent }}>
            {servicePriceLabel(service)}
          </span>
          {service.duration_mins > 0 ? (
            <span className="sf-svc-card-duration">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(service.duration_mins)}
            </span>
          ) : null}
        </div>

        <div className="sf-svc-card-actions">
          <Link href={href} className="sf-svc-card-link" style={{ color: accent }}>
            View details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {service.is_bookable ? (
            <Link
              href={storefrontBookUrl(basePath, service.id)}
              className="sf-svc-card-book"
              style={{ background: accent }}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Book
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
