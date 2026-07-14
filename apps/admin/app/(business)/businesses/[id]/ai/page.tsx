"use client";

import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";
import { BusinessAILimitsPanel } from "@/components/features/admin/business-ai-limits-panel";
import { BusinessWorkspacePageHeader } from "@/components/features/admin/business-workspace-shell";

export default function BusinessAIPage() {
  const { business } = useBusinessWorkspace();
  if (!business) return null;

  return (
    <div>
      <BusinessWorkspacePageHeader
        title="AI"
        description="Monthly token budget and economy model thresholds."
      />
      <BusinessAILimitsPanel business={business} />
    </div>
  );
}
