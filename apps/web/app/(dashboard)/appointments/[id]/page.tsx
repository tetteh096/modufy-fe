"use client";

import { useParams } from "next/navigation";
import { AppointmentDetailView } from "@/components/features/appointments/appointment-detail-view";
import { PageHeader } from "@/components/shared/page-header";

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <PageHeader title="Booking details" description="Service appointment" />
      <AppointmentDetailView id={id} />
    </div>
  );
}
