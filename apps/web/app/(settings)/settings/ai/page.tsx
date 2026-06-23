"use client";

import { Sparkles } from "lucide-react";
import { ModuleSettingsPage } from "@/components/features/settings/module-settings-page";
import { AISettingsForm } from "@/components/features/ai/ai-settings-form";

export default function AISettingsPage() {
  return (
    <ModuleSettingsPage
      moduleKey="ai"
      title="AI"
      description="Budget, billing mode, and provider keys"
      icon={Sparkles}
    >
      <AISettingsForm />
    </ModuleSettingsPage>
  );
}
