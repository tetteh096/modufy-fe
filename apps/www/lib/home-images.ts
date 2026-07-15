/** Curated Modufy marketing imagery: product shots + module illustrations. */
const img = (file: string) => `/website_images/${file}`;

export const homeImages = {
  hero: {
    teamMeeting: img("team-meeting-accra.png"),
    systemsConnected: img("systems-connected.png"),
    retailModules: img("retail-modules.png"),
    dashboardDevices: img("modufy_dashboard_devices_visual.png"),
  },
  features: {
    pipeline: img("modufy_dashboard_devices_visual.png"),
    marketing: img("marketing.png"),
    analytics: img("analytics-illustration.png"),
    tracking: img("inventory.png"),
    invoice: img("invoice.png"),
    inventory: img("inventory.png"),
    inventoryPhoto: img("modufy_inventory_visual.png"),
    orders: img("orders.png"),
    appointments: img("appointments.png"),
    mobile: img("mobile.png"),
    payments: img("modufy_payment_card_visual.png"),
    finance: img("modufy_finance_growth_visual.png"),
  },
  story: {
    support: img("customer-support.png"),
    salesTeam: img("team-collaboration.png"),
    pipeline: img("systems-connected.png"),
  },
  integrations: img("systems-connected.png"),
  cta: img("team-meeting-accra.png"),
  pages: {
    about: img("team-collaboration.png"),
    whyUs: img("team-meeting-accra.png"),
    faq: img("customer-support.png"),
    blog: img("retail-modules.png"),
    docs: img("modufy_dashboard_devices_visual.png"),
    demo: img("systems-connected.png"),
    integrations: img("systems-connected.png"),
    testimonials: img("happy-customers.png"),
    modules: img("retail-modules.png"),
    legal: img("modufy_dashboard_devices_visual.png"),
    notFound: img("modufy_finance_growth_visual.png"),
    team: {
      one: img("team-collaboration.png"),
      two: img("customer-support.png"),
      three: img("team-meeting-accra.png"),
    },
    journey: {
      collaboration: img("team-collaboration.png"),
      workspace: img("modufy_dashboard_devices_visual.png"),
      planning: img("team-meeting-accra.png"),
      meeting: img("customer-support.png"),
      retail: img("retail-modules.png"),
    },
    values: img("team-meeting-accra.png"),
  },
} as const;
