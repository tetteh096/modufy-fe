"use client";

import { useQuery } from "@tanstack/react-query";
import { Puzzle } from "lucide-react";
import { businessApi } from "@/lib/api";
import { MODULE_LABELS } from "@/lib/settings-nav";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Badge } from "@/components/ui/badge";

export default function ModulesSettingsPage() {
  const { data: modulesData, isLoading } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
  });

  const modules = modulesData?.modules ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your plan"
        description="Features enabled on your account. Contact support to upgrade."
      />

      <SettingsSection
        title="Active modules"
        icon={Puzzle}
        description="Enabled modules appear in the main sidebar"
      >
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading modules…</p>
        ) : modules.length === 0 ? (
          <p className="text-sm text-muted-foreground">No modules configured yet.</p>
        ) : (
          <ul className="space-y-2">
            {modules.map((m) => (
              <li
                key={m.module}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <span className="text-sm font-medium">
                    {MODULE_LABELS[m.module] ?? m.module}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {m.enabled
                      ? "Visible in the sidebar"
                      : "Not included on your current plan"}
                  </p>
                </div>
                <Badge variant={m.enabled ? "default" : "secondary"}>
                  {m.enabled ? "Enabled" : "Not on plan"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>
    </div>
  );
}
