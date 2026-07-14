"use client";

import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";
import { SupportSessionPanel } from "@/components/features/admin/support-session-panel";
import { BusinessWorkspacePageHeader } from "@/components/features/admin/business-workspace-shell";

export default function BusinessSupportPage() {
  const { businessId, business } = useBusinessWorkspace();
  if (!business) return null;

  return (
    <div className="max-w-xl space-y-6">
      <BusinessWorkspacePageHeader
        title="Support"
        description="Request access and start a read-only support session in the merchant app."
      />
      <SupportSessionPanel businessId={businessId} />
      {business.stats.open_ticket_count > 0 && (
        <p className="text-sm text-muted-foreground">
          This business has {business.stats.open_ticket_count} open support ticket
          {business.stats.open_ticket_count === 1 ? "" : "s"} — check the Tickets section in the main nav.
        </p>
      )}
    </div>
  );
}
