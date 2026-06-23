import {
  Banknote,
  Smartphone,
  CreditCard,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export const SALE_PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "momo_mtn", label: "MTN MoMo", icon: Smartphone },
  { value: "momo_voda", label: "Vodafone Cash", icon: Smartphone },
  { value: "momo_airtel", label: "AirtelTigo", icon: Smartphone },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "bank", label: "Bank transfer", icon: Landmark },
] as const;

export type SalePaymentMethod = (typeof SALE_PAYMENT_METHODS)[number]["value"];

export const SALE_CURRENCIES = ["GHS", "NGN", "USD", "EUR", "GBP"] as const;

export const QUICK_SALE_SUGGESTIONS = [
  "Product sale",
  "Service",
  "Delivery fee",
  "Repair work",
  "Consultation",
  "Deposit",
] as const;

export function paymentMethodMeta(value: string) {
  return SALE_PAYMENT_METHODS.find((m) => m.value === value);
}
