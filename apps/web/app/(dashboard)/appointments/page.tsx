"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { AppointmentsCalendar } from "@/components/features/appointments/appointments-calendar";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Calendar and list views — filter by status and date, earliest first"
        action={
          <Button nativeButton={false} render={<Link href="/appointments/new" />}>
            <Plus className="h-4 w-4" />
            New booking
          </Button>
        }
      />

      <Suspense
        fallback={
          <div className="flex min-h-[24rem] items-center justify-center text-sm text-muted-foreground">
            <Spinner className="h-6 w-6" />
          </div>
        }
      >
        <AppointmentsCalendar />
      </Suspense>
    </div>
  );
}
