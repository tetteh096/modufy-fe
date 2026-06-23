"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketplaceCouponsManager } from "@/components/features/marketplace/marketplace-coupons-manager";
import { Button } from "@/components/ui/button";

export default function MarketplaceCouponsPage() {
  return (
    <div className="space-y-4 p-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" nativeButton={false} render={<Link href="/marketplace" />}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Storefront
      </Button>
      <MarketplaceCouponsManager />
    </div>
  );
}
