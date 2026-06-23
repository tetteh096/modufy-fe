"use client";

import { BarChart3 } from "lucide-react";
import { ModuleSettingsPage } from "@/components/features/settings/module-settings-page";

export default function AccountsSettingsPage() {
  return (
    <ModuleSettingsPage
      moduleKey="accounts"
      title="Accounts"
      description="Fiscal year, report cadence, and export preferences"
      icon={BarChart3}
    />
  );
}
