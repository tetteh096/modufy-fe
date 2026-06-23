"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api";
import { InventoryItemForm } from "@/components/features/inventory/inventory-item-form";
import { SectionLoader } from "@/components/shared/page-loader";

export default function EditInventoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: item, isLoading } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => inventoryApi.get(id),
    enabled: !!id,
  });

  if (isLoading || !item) {
    return <SectionLoader />;
  }

  const itemType = item.type === "service" ? "service" : "product";

  return <InventoryItemForm mode="edit" itemType={itemType} item={item} />;
}
