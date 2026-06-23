"use client";

import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { marketplaceApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketplaceStorefrontEditor } from "@/components/features/marketplace/marketplace-storefront-editor";
import { SITE_BASE } from "@/components/features/marketplace/marketplace-storefront-shared";

export default function MarketplacePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["marketplace-profile"],
    queryFn: marketplaceApi.profile.get,
  });

  const storefrontURL = profile ? `${SITE_BASE}/p/${profile.business_slug}` : "";

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full max-w-3xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Marketplace"
        description="Pick a section on the left — see what's live, edit below, save at the bottom"
        action={
          profile?.is_public ? (
            <a href={storefrontURL} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View live
              </Button>
            </a>
          ) : undefined
        }
      />
      <MarketplaceStorefrontEditor />
    </div>
  );
}
