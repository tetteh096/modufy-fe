"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { publicBookingApi } from "@/lib/public-api";
import { Spinner } from "@/components/shared/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAppointmentDate, formatAppointmentTime } from "@/components/features/appointments/appointment-status";
import { formatMoney } from "@/lib/format";

function BookingConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["booking-confirm", token],
    queryFn: () => publicBookingApi.confirm(token),
    enabled: !!token,
    refetchInterval: (q) =>
      q.state.data?.status === "pending" ? 3000 : false,
  });

  if (!token) {
    return <p className="p-8 text-center text-muted-foreground">Invalid confirmation link.</p>;
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const confirmed = data.status === "confirmed" || data.deposit_paid > 0;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{confirmed ? "Booking confirmed" : "Processing payment…"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Business:</span> {data.business_name}
          </p>
          <p>
            <span className="text-muted-foreground">Service:</span> {data.service_name}
          </p>
          <p>
            <span className="text-muted-foreground">When:</span>{" "}
            {formatAppointmentDate(data.start_time)} at {formatAppointmentTime(data.start_time)}
          </p>
          {data.deposit_required > 0 && (
            <p>
              <span className="text-muted-foreground">Deposit:</span>{" "}
              {formatMoney(data.deposit_paid || data.deposit_required, data.currency)}
            </p>
          )}
          {!confirmed && (
            <p className="text-muted-foreground pt-2">
              Waiting for payment confirmation. This page will update automatically.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center">Loading…</div>}>
      <BookingConfirmContent />
    </Suspense>
  );
}
