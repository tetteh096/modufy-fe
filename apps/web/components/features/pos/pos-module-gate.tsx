"use client";

import Link from "next/link";
import { Lock, Package } from "lucide-react";
import { useBusinessModules } from "@/hooks/use-business-modules";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PosModuleGate({ children }: { children: React.ReactNode }) {
  const { isLoading, enabledModules } = useBusinessModules();

  if (isLoading) return <SectionLoader />;

  const posOn = enabledModules.has("pos");
  const inventoryOn = enabledModules.has("inventory");

  if (!posOn) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md w-full border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Lock className="h-10 w-10 text-muted-foreground" />
            <h1 className="text-xl font-semibold">POS is not on your plan</h1>
            <p className="text-sm text-muted-foreground">
              Enable the POS module from Settings → Your plan, or ask your admin to upgrade.
            </p>
            <Button nativeButton={false} render={<Link href="/settings/modules" />}>
              View your plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!inventoryOn) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md w-full border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Inventory required</h1>
            <p className="text-sm text-muted-foreground">
              POS needs your product catalogue from Inventory. Enable Inventory first.
            </p>
            <Button nativeButton={false} render={<Link href="/settings/modules" />}>
              View your plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
