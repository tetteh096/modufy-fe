"use client";

import Link from "next/link";
import type { PublicWorkProjectSummary } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

export function StorefrontWorkGrid({
  projects,
  basePath,
  accent,
}: {
  projects: PublicWorkProjectSummary[];
  basePath: string;
  accent: string;
}) {
  return (
    <div className="sf-work-grid">
      {projects.map((project, index) => {
        const featured = index === 0 && projects.length >= 3;
        return (
          <Link
            key={project.id}
            href={`${basePath}/work/${project.id}`}
            className={cn("sf-work-card", featured && "sf-work-card--featured")}
          >
            <div className="sf-work-card-media">
              {project.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveMediaUrl(project.cover_url)} alt={project.title} />
              ) : (
                <div className="sf-work-card-fallback" style={{ color: accent }}>
                  {project.title.slice(0, 1)}
                </div>
              )}
            </div>

            <div className="sf-work-panel sf-work-card-panel">
              <p className="sf-work-panel-eyebrow">
                <span className="sf-work-panel-line" style={{ background: accent }} aria-hidden />
                Project
              </p>
              <h3 className="sf-work-panel-title">{project.title}</h3>
              <span className="sf-work-panel-cta">
                View project <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
