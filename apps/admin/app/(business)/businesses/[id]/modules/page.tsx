"use client";

import { BusinessModulesPanel } from "@/components/features/admin/business-modules-panel";
import { BusinessWorkspacePageHeader } from "@/components/features/admin/business-workspace-shell";
import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";

export default function BusinessModulesPage() {
  const { business } = useBusinessWorkspace();
  const activeCount = business?.modules_enabled.length ?? 0;

  return (
    <div>
      <BusinessWorkspacePageHeader
        title="Modules & access"
        description={
          activeCount > 0
            ? `${activeCount} paid module${activeCount === 1 ? "" : "s"} enabled for ${business?.name ?? "this tenant"}. Core features (sales, customers, dashboard) are always on.`
            : "Turn paid features on or off for this tenant. Core platform access is always included."
        }
      />
      <BusinessModulesPanel />
    </div>
  );
}
