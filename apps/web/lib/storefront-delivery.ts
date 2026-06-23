import type { StorefrontDeliverySettings } from "@/types/api";

export const FEE_TYPE_OPTIONS = [
  { value: "free", label: "Free", hint: "No delivery charge (e.g. Accra free)" },
  { value: "fixed", label: "Fixed fee", hint: "Add a set amount to the order total" },
  { value: "customer_pays", label: "Customer pays separately", hint: "Bolt, courier, rider — not on this bill" },
  { value: "quote", label: "Confirm after order", hint: "You quote the fee once you see the address" },
] as const;

export function defaultDeliverySettings(): StorefrontDeliverySettings {
  return {
    enabled: true,
    instructions: "",
    require_map_pin: true,
    allow_pay_on_delivery: true,
    allow_pay_online: false,
    booking_instructions: "",
    rules: [
      {
        id: "standard",
        label: "Standard delivery",
        description: "We deliver to your location — fee confirmed after you order",
        fee_type: "quote",
        sort_order: 0,
      },
    ],
  };
}

export function normalizeDeliverySettings(
  input?: Partial<StorefrontDeliverySettings> | null,
): StorefrontDeliverySettings {
  const base = defaultDeliverySettings();
  if (!input) return base;
  const rules =
    input.rules && input.rules.length > 0
      ? input.rules.map((r, i) => ({
          id: r.id || `rule-${i}`,
          label: r.label?.trim() || `Option ${i + 1}`,
          description: r.description ?? "",
          fee_type: r.fee_type ?? "quote",
          fee_amount: r.fee_amount ?? 0,
          fee_note: r.fee_note ?? "",
          sort_order: r.sort_order ?? i,
        }))
      : base.rules;
  return {
    enabled: input.enabled ?? base.enabled,
    instructions: input.instructions ?? "",
    require_map_pin: input.require_map_pin ?? base.require_map_pin,
    allow_pay_on_delivery: input.allow_pay_on_delivery ?? base.allow_pay_on_delivery,
    allow_pay_online: input.allow_pay_online ?? base.allow_pay_online,
    booking_instructions: input.booking_instructions ?? "",
    rules,
  };
}

export function deliveryFeeSummary(
  rule: StorefrontDeliverySettings["rules"][0],
  currency: string,
): string {
  switch (rule.fee_type) {
    case "free":
      return "Free";
    case "fixed":
      return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(rule.fee_amount ?? 0);
    case "customer_pays":
      return rule.fee_note?.trim() || "Paid separately";
    case "quote":
    default:
      return "Confirmed after order";
  }
}

export function orderTotalWithDelivery(subtotalAfterDiscount: number, deliveryFee: number): number {
  return subtotalAfterDiscount + deliveryFee;
}
