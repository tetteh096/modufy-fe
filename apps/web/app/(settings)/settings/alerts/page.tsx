"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AlertRulesSettings } from "@/components/features/settings/alert-rules-settings";
import { SMSWalletSection } from "@/components/features/settings/sms-wallet-section";
import { Button } from "@/components/ui/button";

export default function AlertsSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <PageHeader
        title="Alerts"
        description="SMS credits for customer messages, plus rules for when Modufy should warn you about money, stock, and tax."
        action={
          <Button variant="outline" size="sm" className="gap-1.5 h-8" render={<Link href="/alerts" />}>
            <Bell className="h-4 w-4" />
            View alerts
          </Button>
        }
      />

      <SMSWalletSection />
      <AlertRulesSettings />
    </div>
  );
}