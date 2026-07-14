"use client";

import { BusinessNotesPanel } from "@/components/features/admin/business-notes-panel";
import { BusinessWorkspacePageHeader } from "@/components/features/admin/business-workspace-shell";

export default function BusinessNotesPage() {
  return (
    <div className="max-w-2xl">
      <BusinessWorkspacePageHeader
        title="Internal notes"
        description="Private notes visible only to platform admins."
      />
      <BusinessNotesPanel />
    </div>
  );
}
