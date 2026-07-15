import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import {
  AppointmentsAudienceStrip,
  AppointmentsCloseSection,
  AppointmentsFlowSection,
  AppointmentsSlotMarquee,
  AppointmentsVisualFeatures,
} from "@/components/modules/appointments/appointments-visual-sections";
import { moduleHeroImages } from "@/lib/module-heroes";

export function AppointmentsPage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Appointments & Bookings"
        eyebrow="Paid module"
        title="Fill your calendar"
        titleAccent="without the back-and-forth."
        description="Guests book from your storefront. Collect a deposit, send reminders, and auto-create an invoice when the session is done."
        image={moduleHeroImages.appointments}
        imageAlt="Appointment booking calendar"
      />
      <AppointmentsSlotMarquee />
      <AppointmentsFlowSection />
      <AppointmentsVisualFeatures />
      <AppointmentsAudienceStrip />
      <AppointmentsCloseSection />
    </>
  );
}
