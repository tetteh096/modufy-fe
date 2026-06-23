"use client";

import { Package } from "lucide-react";
import { ModuleSettingsPage } from "@/components/features/settings/module-settings-page";

export default function InventorySettingsPage() {
  return (
    <ModuleSettingsPage
      moduleKey="inventory"
      title="Inventory"
      description="Stock alerts, units, and product photo defaults"
      icon={Package}
    />
  );
}
