import {
  Home,
  Truck,
  Package,
  Users,
  Zap,
  Megaphone,
  Smartphone,
  CircleDollarSign,
  Banknote,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export const EXPENSE_CATEGORIES = [
  { value: "rent", label: "Rent", icon: Home },
  { value: "transport", label: "Transport", icon: Truck },
  { value: "supplies", label: "Supplies", icon: Package },
  { value: "staff", label: "Staff & wages", icon: Users },
  { value: "utilities", label: "Utilities", icon: Zap },
  { value: "marketing", label: "Marketing", icon: Megaphone },
  { value: "phone", label: "Phone & data", icon: Smartphone },
  { value: "other", label: "Other", icon: CircleDollarSign },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["value"];

export const EXPENSE_PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "momo", label: "Mobile Money", icon: Smartphone },
  { value: "bank", label: "Bank transfer", icon: Landmark },
] as const;

export type ExpensePaymentMethod = (typeof EXPENSE_PAYMENT_METHODS)[number]["value"];

export function expenseCategoryMeta(value: string) {
  return EXPENSE_CATEGORIES.find((c) => c.value === value);
}

export function expensePaymentMeta(value: string) {
  return EXPENSE_PAYMENT_METHODS.find((m) => m.value === value);
}
