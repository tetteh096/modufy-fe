"use client";

import { Star } from "lucide-react";
import type { PublicStorefront } from "@/types/api";
import { cn } from "@/lib/utils";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="storefront-star-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("h-3.5 w-3.5", i <= rating ? "is-filled" : "")}
        />
      ))}
    </div>
  );
}

export function StorefrontReviewsSection({
  sf,
  accent,
  limit,
}: {
  sf: PublicStorefront;
  accent: string;
  limit?: number;
}) {
  const reviews = limit ? sf.reviews.slice(0, limit) : sf.reviews;
  if (reviews.length === 0) return null;

  return (
    <section className="storefront-section">
      <h2 className="storefront-section-title">
        Reviews
        {sf.review_count > 0 ? (
          <span className="storefront-section-sub">
            {sf.avg_rating.toFixed(1)} ★ · {sf.review_count} total
          </span>
        ) : null}
      </h2>
      <div className="storefront-reviews-grid">
        {reviews.map((r) => (
          <article key={r.id} className="storefront-review-card">
            <div className="storefront-review-head">
              <p>{r.reviewer_name}</p>
              <StarRow rating={r.rating} />
            </div>
            {r.comment ? <p className="storefront-review-comment">{r.comment}</p> : null}
            {r.business_reply ? (
              <div className="storefront-review-reply" style={{ borderColor: accent }}>
                <p className="storefront-review-reply-label" style={{ color: accent }}>
                  Seller reply
                </p>
                <p>{r.business_reply}</p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
