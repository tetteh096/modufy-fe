"use client";

import { useQuery } from "@tanstack/react-query";
import { publicBookingApi } from "@/lib/public-api";
import { PublicBookingFlow } from "@/components/features/booking/public-booking-flow";
import { Spinner } from "@/components/shared/spinner";

export function PublicBookingPageClient({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-booking", slug],
    queryFn: () => publicBookingApi.services(slug),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !data?.services?.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Booking unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          This business is not accepting online bookings right now.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PublicBookingFlow slug={slug} business={data.business} services={data.services} />
    </div>
  );
}
