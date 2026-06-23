"use client";

import { FileText } from "lucide-react";
import { ModuleSettingsPage } from "@/components/features/settings/module-settings-page";
import { InvoiceSettingsForm } from "@/components/features/invoices/invoice-settings-form";

export default function InvoicesSettingsPage() {
  return (
    <ModuleSettingsPage
      moduleKey="invoices"
      title="Invoices"
      description="PDF templates, numbering, and default terms"
      icon={FileText}
    >
      <InvoiceSettingsForm />
    </ModuleSettingsPage>
  );
}
