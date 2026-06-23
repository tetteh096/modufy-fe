"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useStorefront } from "./storefront-context";

export function StorefrontPdpTopbar({
  crumbs,
}: {
  crumbs: { label: string; href?: string }[];
}) {
  const { basePath } = useStorefront();

  return (
    <div className="sf-pdp-topbar">
      <nav className="sf-pdp-topbar-inner" aria-label="Breadcrumb">
        <Link href={basePath}>Home</Link>
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`} className="sf-pdp-topbar-crumb">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </span>
        ))}
      </nav>
    </div>
  );
}
