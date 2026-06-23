"use client";

import { Monitor } from "lucide-react";
import { ModuleSettingsPage } from "@/components/features/settings/module-settings-page";
import { PosSettingsForm } from "@/components/features/pos/pos-settings-form";

export default function PosSettingsPage() {
  return (
    <ModuleSettingsPage
      moduleKey="pos"
      title="POS"
      description="Receipts, default payment, and register behaviour"
      icon={Monitor}
    >
      <PosSettingsForm />
    </ModuleSettingsPage>
  );
}
