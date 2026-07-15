/** Full-bleed module heroes from apps/www/public/hero */
export const moduleHeroImages = {
  core: "/hero/africa.jpg",
  invoices: "/hero/invoce.png",
  inventory: "/hero/inventoryhero.jpg",
  pos: "/hero/pos.png",
  appointments: "/hero/calender.jpg",
  marketplace: "/landingscroll/e55a842eae7770fbeafd3c7b8bf77bd8.jpg",
  marketing: "/hero/marketing.png",
  accounts: "/hero/finicail.png",
  blog: "/hero/blog.jpg",
  ai: "/hero/africa.jpg",
  pharmacy: "/website_images/inventory.png",
  inventoryAlt: "/hero/inventory-img.jpg",
} as const;

export type ModuleHeroKey = keyof typeof moduleHeroImages;
