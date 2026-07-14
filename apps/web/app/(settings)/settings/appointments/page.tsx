"use client";

import { PageHeader } from "@/components/shared/page-header";
import { AppointmentsSettingsForm } from "@/components/features/appointments/appointments-settings-form";

export default function AppointmentsSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <PageHeader
        title="Appointments"
        description="Booking link, cancellation rules, scheduling buffers, and SMS reminders."
      />
      <AppointmentsSettingsForm />
    </div>
  );
}
