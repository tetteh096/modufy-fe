"use client";

import Link from "next/link";
import { Bell, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AlertRulesSettings } from "@/components/features/settings/alert-rules-settings";
import { Button } from "@/components/ui/button";

export default function AlertsSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Alerts"
        description="Control when BizOS warns you about invoices, stock, appointments, and tax filing."
        action={
          <Button variant="outline" size="sm" className="gap-1.5 h-8" render={<Link href="/alerts" />}>
            <Bell className="h-4 w-4" />
            View alerts
          </Button>
        }
      />

      <AlertRulesSettings />
    </div>
  );
}
