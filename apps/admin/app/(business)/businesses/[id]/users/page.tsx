"use client";

import { BusinessTeamPanel } from "@/components/features/admin/business-team-panel";
import { BusinessWorkspacePageHeader } from "@/components/features/admin/business-workspace-shell";
import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";

export default function BusinessUsersPage() {
  const { business } = useBusinessWorkspace();
  const count = business?.users.length ?? 0;

  return (
    <div>
      <BusinessWorkspacePageHeader
        title="Team"
        description={
          count > 0
            ? `People with access to ${business?.name ?? "this tenant"} — owners, managers, and staff.`
            : "No users on this account yet."
        }
      />
      <BusinessTeamPanel />
    </div>
  );
}
