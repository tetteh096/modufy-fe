"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { Lock, ArrowRight } from "lucide-react";
import { businessApi } from "@/lib/api";
import { MODULE_LABELS } from "@/lib/settings-nav";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ModuleSettingsPageProps {
  moduleKey: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export function ModuleSettingsPage({
  moduleKey,
  title,
  description,
  icon: Icon,
  children,
}: ModuleSettingsPageProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
  });

  if (isLoading) return <SectionLoader />;

  const mod = data?.modules.find((m) => m.module === moduleKey);
  const enabled = mod?.enabled ?? false;
  const label = MODULE_LABELS[moduleKey] ?? title;

  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        action={
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "Enabled" : "Not on plan"}
          </Badge>
        }
      />

      {!enabled ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center text-center gap-4 py-12 px-6">
            <div className="rounded-full bg-muted p-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="font-semibold text-lg">{label} is not on your plan</h3>
              <p className="text-sm text-muted-foreground">
                When your admin enables this module, its settings will appear here — same
                layout as your other module sidebars in the main app.
              </p>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/settings/modules" />}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              View your plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {children ?? (
            <SettingsSection
              title={`${label} preferences`}
              description="Module-specific options will be added here as features ship."
              icon={Icon}
            >
              <p className="text-sm text-muted-foreground">
                You have access to {label}. Configure defaults, notifications, and integrations
                in this space — separate from core business settings.
              </p>
            </SettingsSection>
          )}
        </div>
      )}
    </div>
  );
}
