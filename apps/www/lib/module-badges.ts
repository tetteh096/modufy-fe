/** 3D badge art for the modules index and category cards. */
const badge = (file: string) => `/modules/${file}`;

export const moduleBadges = {
  core: badge("core.png"),
  invoices: badge("invoices.png"),
  inventory: badge("inventory.png"),
  pos: badge("pos.png"),
  appointments: badge("appointments.png"),
  marketplace: badge("marketplace.png"),
  marketing: badge("marketing.png"),
  accounts: badge("accounts.png"),
  blog: badge("blog.png"),
  ai: badge("ai.png"),
  team: badge("team.png"),
  alerts: badge("alerts.png"),
} as const;

export function getModuleBadge(slug: string): string {
  return moduleBadges[slug as keyof typeof moduleBadges] ?? moduleBadges.core;
}
