export const SALE_SOURCE_OPTIONS = [
  { value: "all", label: "All channels" },
  { value: "pos", label: "POS register" },
  { value: "manual", label: "Manual sales" },
  { value: "storefront_order", label: "Online orders" },
  { value: "appointment", label: "Appointments" },
] as const;

export type SaleSourceFilter = (typeof SALE_SOURCE_OPTIONS)[number]["value"];

export function saleSourceLabel(source?: string): string {
  switch (source) {
    case "pos":
      return "POS";
    case "manual":
      return "Manual";
    case "storefront_order":
      return "Online";
    case "appointment":
      return "Booking";
    default:
      return source ? source.replace(/_/g, " ") : "Sale";
  }
}

export function saleSourceBadgeClass(source?: string): string {
  switch (source) {
    case "pos":
      return "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20";
    case "storefront_order":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20";
    case "appointment":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
