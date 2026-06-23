"use client";

import { use } from "react";
import { StorefrontProvider } from "@/components/features/storefront/storefront-context";
import { StorefrontShell } from "@/components/features/storefront/storefront-shell";

export default function SlugStorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <StorefrontProvider slug={slug}>
      <StorefrontShell>{children}</StorefrontShell>
    </StorefrontProvider>
  );
}
