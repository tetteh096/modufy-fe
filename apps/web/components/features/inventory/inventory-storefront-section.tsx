"use client";

import { Star, Store } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type InventoryStorefrontSectionProps = {
  storefrontVisible: boolean;
  isFeatured: boolean;
  onStorefrontVisibleChange: (value: boolean) => void;
  onFeaturedChange: (value: boolean) => void;
  featuredDisabled?: boolean;
};

export function InventoryStorefrontSection({
  storefrontVisible,
  isFeatured,
  onStorefrontVisibleChange,
  onFeaturedChange,
  featuredDisabled,
}: InventoryStorefrontSectionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Storefront
        </CardTitle>
        <CardDescription>Control how this product appears on your public shop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-4">
          <div>
            <p className="text-sm font-medium">Visible on storefront</p>
            <p className="text-xs text-muted-foreground">Show in your shop catalog and search</p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary cursor-pointer"
            checked={storefrontVisible}
            onChange={(e) => onStorefrontVisibleChange(e.target.checked)}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-4">
          <div>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              Featured on homepage
            </p>
            <p className="text-xs text-muted-foreground">
              Appears in &ldquo;Our favourites&rdquo; — up to 5 featured products
            </p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary cursor-pointer"
            disabled={featuredDisabled || !storefrontVisible}
            checked={isFeatured && storefrontVisible}
            onChange={(e) => {
              const next = e.target.checked;
              if (next) onStorefrontVisibleChange(true);
              onFeaturedChange(next);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
