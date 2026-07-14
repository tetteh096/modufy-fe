"use client";

import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";
import { BusinessCreditsPanel } from "@/components/features/admin/business-credits-panel";
import { BusinessWorkspacePageHeader } from "@/components/features/admin/business-workspace-shell";

export default function BusinessSMSPage() {
  const { businessId } = useBusinessWorkspace();

  return (
    <div>
      <BusinessWorkspacePageHeader
        title="SMS & email credits"
        description="Wallet balances, admin top-ups, and recent usage for SMS and marketing email."
      />
      <BusinessCreditsPanel businessId={businessId} />
    </div>
  );
}
