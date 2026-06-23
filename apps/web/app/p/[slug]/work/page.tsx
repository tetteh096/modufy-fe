"use client";

import { Suspense } from "react";
import Link from "next/link";
import { StorefrontTextHero } from "@/components/features/storefront/storefront-text-hero";
import { StorefrontWorkGrid } from "@/components/features/storefront/storefront-work-grid";
import { StorefrontWorkHero } from "@/components/features/storefront/storefront-work-hero";
import { useStorefront } from "@/components/features/storefront/storefront-context";

function WorkContent() {
  const { sf, accent, basePath } = useStorefront();

  if (!sf) return null;

  const label = sf.nav_work_label || "Portfolio";
  const projects = sf.show_work ? (sf.work_projects ?? []) : [];

  if (!sf.show_work) {
    return (
      <main className="storefront-main storefront-main--flush">
        <StorefrontTextHero watermark="PORTFOLIO" title="Page not available" accent={accent} />
        <div className="storefront-shop-empty">
          <p>This page is not published.</p>
          <Link href={basePath} className="storefront-section-link" style={{ color: accent }}>
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const heroProjects = projects.filter((p) => p.hero_urls?.length || p.cover_url);

  return (
    <main className="storefront-main storefront-main--flush">
      {heroProjects.length > 0 ? (
        <StorefrontWorkHero projects={projects} basePath={basePath} />
      ) : (
        <StorefrontTextHero
          watermark="PORTFOLIO"
          eyebrow={label}
          title={label}
          description={`Explore completed projects from ${sf.business_name}.`}
          accent={accent}
          crumbs={[{ label }]}
          meta={
            projects.length > 0 ? (
              <span className="sf-text-hero-stat">
                <strong>{projects.length}</strong>
                <span>project{projects.length === 1 ? "" : "s"}</span>
              </span>
            ) : undefined
          }
        />
      )}

      {sf.work_intro ? (
        <section className="sf-work-intro">
          <p className="sf-work-detail-eyebrow">
            <span className="sf-work-panel-line" style={{ background: accent }} aria-hidden />
            {label}
          </p>
          <p className="sf-work-intro-text">{sf.work_intro}</p>
        </section>
      ) : null}

      {projects.length > 0 ? (
        <div className="sf-work-page-wrap">
          <StorefrontWorkGrid projects={projects} basePath={basePath} accent={accent} />
        </div>
      ) : (
        <div className="storefront-shop-empty sf-work-empty">
          <p>Projects will appear here once they are published.</p>
          <Link href={`${basePath}/contact`} className="storefront-section-link" style={{ color: accent }}>
            Contact {sf.business_name}
          </Link>
        </div>
      )}
    </main>
  );
}

export default function StorefrontWorkPage() {
  return (
    <Suspense
      fallback={
        <main className="storefront-main">
          <div className="storefront-shop-empty">Loading…</div>
        </main>
      }
    >
      <WorkContent />
    </Suspense>
  );
}
