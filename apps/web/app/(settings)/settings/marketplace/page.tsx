"use client";

import { Store } from "lucide-react";
import { ModuleSettingsPage } from "@/components/features/settings/module-settings-page";
import { MarketplaceSettingsForm } from "@/components/features/marketplace/marketplace-settings-form";

export default function MarketplaceSettingsPage() {
  return (
    <ModuleSettingsPage
      moduleKey="marketplace"
      title="Marketplace"
      description="Storefront visibility, brand, and guest checkout"
      icon={Store}
    >
      <MarketplaceSettingsForm />
    </ModuleSettingsPage>
  );
}
