"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketplaceDealsManager } from "@/components/features/marketplace/marketplace-deals-manager";
import { Button } from "@/components/ui/button";

export default function MarketplaceDealsPage() {
  return (
    <div className="space-y-4 p-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" nativeButton={false} render={<Link href="/marketplace" />}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Storefront
      </Button>
      <MarketplaceDealsManager />
    </div>
  );
}
