"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlockTimeForm } from "@/components/features/appointments/block-time-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function AppointmentsSchedulePage() {
  return (
    <div className="w-full max-w-5xl space-y-8">
      <PageHeader
        title="Block time"
        description="Lunch, holidays, or days off — customers cannot book during these periods."
        action={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            nativeButton={false}
            render={<Link href="/appointments" />}
          >
            <ArrowLeft className="h-4 w-4" />
            Calendar
          </Button>
        }
      />
      <BlockTimeForm />
    </div>
  );
}
