"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InventoryItemForm } from "@/components/features/inventory/inventory-item-form";
import { SectionLoader } from "@/components/shared/page-loader";

function NewInventoryPageInner() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") === "service" ? "service" : "product";
  return <InventoryItemForm mode="create" itemType={type} />;
}

export default function NewInventoryPage() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <NewInventoryPageInner />
    </Suspense>
  );
}
