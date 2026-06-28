"use client";

import { useQuery } from "@tanstack/react-query";
import { publicBookingApi } from "@/lib/public-api";
import { PublicBookingFlow } from "@/components/features/booking/public-booking-flow";
import { BookingOrbitHero } from "@/components/features/booking/booking-orbit-hero";
import { Spinner } from "@/components/shared/spinner";
import "@/components/shared/flow-motion.css";

export function PublicBookingPageClient({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-booking", slug],
    queryFn: () => publicBookingApi.services(slug),
  });

  if (isLoading) {
    return (
      <div className="booking-portal flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !data?.services?.length) {
    return (
      <div className="booking-portal flex min-h-screen items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <h1 className="text-xl font-semibold">Booking unavailable</h1>
          <p className="mt-2 text-[var(--booking-muted,#5d6b7e)]">
            This business is not accepting online bookings right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-portal flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="booking-shell flex w-full max-w-[1060px] flex-col overflow-hidden rounded-3xl lg:min-h-[640px] lg:flex-row">
        <BookingOrbitHero business={data.business} />

        <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-[420px]">
            <PublicBookingFlow
              slug={slug}
              business={data.business}
              services={data.services}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
