"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { BusinessHoursSection } from "@/components/features/settings/business-hours-section";

const DEFAULT_HOURS = [
  { day_of_week: 0, is_closed: true, open_time: "09:00", close_time: "17:00" },
  { day_of_week: 1, is_closed: false, open_time: "09:00", close_time: "17:00" },
  { day_of_week: 2, is_closed: false, open_time: "09:00", close_time: "17:00" },
  { day_of_week: 3, is_closed: false, open_time: "09:00", close_time: "17:00" },
  { day_of_week: 4, is_closed: false, open_time: "09:00", close_time: "17:00" },
  { day_of_week: 5, is_closed: false, open_time: "09:00", close_time: "17:00" },
  { day_of_week: 6, is_closed: false, open_time: "09:00", close_time: "13:00" },
];

export default function HoursSettingsPage() {
  const { data: business, isLoading } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  if (isLoading || !business) return <SectionLoader />;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        title="Business hours"
        description="Opening times for appointment booking and your public storefront"
      />
      <BusinessHoursSection
        initialHoursEnabled={business.hours_enabled ?? false}
        initialShowHours={business.show_hours ?? false}
        initialHours={business.hours?.length ? business.hours : DEFAULT_HOURS}
      />
    </div>
  );
}
