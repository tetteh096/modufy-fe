"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { StorefrontTextHero } from "@/components/features/storefront/storefront-text-hero";
import { StorefrontWorkDetail } from "@/components/features/storefront/storefront-work-detail";
import { useStorefront } from "@/components/features/storefront/storefront-context";
import { publicApi } from "@/lib/api";
import type { PublicWorkProjectDetail } from "@/types/api";
import { Spinner } from "@/components/shared/spinner";

export default function StorefrontWorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = use(params);
  const { sf, accent, basePath } = useStorefront();
  const [project, setProject] = useState<PublicWorkProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sf?.business_slug) return;
    setLoading(true);
    setError(false);
    publicApi
      .workProject(sf.business_slug, id)
      .then(setProject)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [sf?.business_slug, id]);

  if (!sf) return null;

  const label = sf.nav_work_label || "Portfolio";

  if (!sf.show_work) {
    return (
      <main className="storefront-main storefront-main--flush">
        <StorefrontTextHero watermark="PORTFOLIO" title="Page not available" accent={accent} />
        <div className="storefront-shop-empty">
          <p>This page is not published.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="storefront-main storefront-main--flush">
        <div className="storefront-shop-empty flex flex-col items-center gap-3">
          <Spinner />
          <p>Loading project…</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="storefront-main storefront-main--flush">
        <StorefrontTextHero watermark="PORTFOLIO" title="Project not found" accent={accent} />
        <div className="storefront-shop-empty">
          <p>This project is no longer available.</p>
          <Link href={`${basePath}/work`} className="storefront-section-link" style={{ color: accent }}>
            Back to {label}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="storefront-main storefront-main--flush storefront-main--pdp">
      <StorefrontWorkDetail sf={sf} project={project} basePath={basePath} accent={accent} />
    </main>
  );
}
