import type { Customer } from "@/types/api";

/** Label for lists, sales picker, and invoices — includes contact when company. */
export function customerDisplayLabel(
  c: Pick<Customer, "name" | "contact_name" | "display_name"> & {
    customer_type?: Customer["customer_type"];
  }
) {
  if (c.display_name) return c.display_name;
  if (c.customer_type === "company" && c.contact_name) {
    return `${c.name} (${c.contact_name})`;
  }
  return c.name;
}

export function customerTypeLabel(type: string) {
  return type === "company" ? "Company" : "Individual";
}

export function customerSourceLabel(source?: string) {
  if (source === "website") return "Website";
  return "Manual";
}
