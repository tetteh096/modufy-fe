"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateAppointmentForm } from "@/components/features/appointments/create-appointment-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function NewAppointmentPage() {
  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="New booking"
        description="Schedule a service for a customer or walk-in — under a minute."
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
      <CreateAppointmentForm />
    </div>
  );
}
