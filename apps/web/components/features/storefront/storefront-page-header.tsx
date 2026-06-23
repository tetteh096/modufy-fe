"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useStorefront } from "./storefront-context";

export function StorefrontPageHeader({
  title,
  description,
  crumbs,
}: {
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  const { basePath } = useStorefront();

  return (
    <div className="storefront-page-header">
      <nav className="storefront-breadcrumbs" aria-label="Breadcrumb">
        <Link href={basePath}>Home</Link>
        {(crumbs ?? []).map((c, i) => (
          <span key={`${c.label}-${i}`} className="storefront-breadcrumb-item">
            <ChevronRight className="h-3.5 w-3.5" />
            {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
          </span>
        ))}
      </nav>
      <h1 className="storefront-page-title">{title}</h1>
      {description ? <p className="storefront-page-desc">{description}</p> : null}
    </div>
  );
}
