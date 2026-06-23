"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { publicBookingApi } from "@/lib/public-api";
import { PublicBookingFlow } from "@/components/features/booking/public-booking-flow";
import { Spinner } from "@/components/shared/spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function StorefrontBookingSheet({
  slug,
  open,
  preselectedServiceId,
  onClose,
}: {
  slug: string;
  open: boolean;
  preselectedServiceId?: string;
  onClose: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["public-booking-services", slug],
    queryFn: () => publicBookingApi.services(slug),
    enabled: open,
  });

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle>Book an appointment</SheetTitle>
        </SheetHeader>
        <div className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : !data?.services?.length ? (
            <div className="storefront-booking-empty">
              <CalendarDays className="h-10 w-10" />
              <p>No bookable services available right now.</p>
            </div>
          ) : (
            <PublicBookingFlow
              slug={slug}
              business={data.business}
              services={
                preselectedServiceId
                  ? data.services
                      .filter((s) => s.id === preselectedServiceId)
                      .concat(data.services.filter((s) => s.id !== preselectedServiceId))
                  : data.services
              }
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
