"use client";

import Link from "next/link";
import { CalendarDays, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBusinessModules } from "@/hooks/use-business-modules";
import { cn } from "@/lib/utils";

export function TopBarQuickNav() {
  const { isMarketplaceEnabled, isAppointmentsEnabled } = useBusinessModules();
  const showOrders = isMarketplaceEnabled || isAppointmentsEnabled;

  if (!showOrders && !isAppointmentsEnabled) return null;

  return (
    <div className="hidden md:flex items-center gap-1 mr-auto">
      {showOrders ? (
        <Button
          nativeButton={false}
          render={<Link href="/orders" />}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ClipboardList className="h-4 w-4" />
          Orders
        </Button>
      ) : null}
      {isAppointmentsEnabled ? (
        <Button
          nativeButton={false}
          render={<Link href="/appointments" />}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-muted-foreground hover:text-foreground",
            !showOrders && "ml-0",
          )}
          title="Appointment calendar"
        >
          <CalendarDays className="h-4 w-4" />
          <span className="sr-only">Appointment calendar</span>
        </Button>
      ) : null}
    </div>
  );
}
