const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  momo_mtn: "MTN MoMo",
  momo_voda: "Vodafone Cash",
  momo_airtel: "AirtelTigo Money",
  momo: "Mobile Money",
  card: "Card",
  bank: "Bank transfer",
};

const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  rent: "Rent",
  transport: "Transport",
  supplies: "Supplies",
  staff: "Staff",
  utilities: "Utilities",
  marketing: "Marketing",
  phone: "Phone & data",
  other: "Other",
};

const CURRENCY_LOCALE: Record<string, string> = {
  GHS: "en-GH",
  NGN: "en-NG",
  KES: "en-KE",
  ZAR: "en-ZA",
  GBP: "en-GB",
  USD: "en-US",
  EUR: "de-DE",
};

export function formatMoney(amount: number, currency = "GHS") {
  const locale = CURRENCY_LOCALE[currency] ?? "en";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatPaymentMethod(method: string) {
  return PAYMENT_METHOD_LABELS[method] ?? method.replace(/_/g, " ");
}

export function formatExpenseCategory(category: string) {
  return EXPENSE_CATEGORY_LABELS[category] ?? category;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Date + time for order/appointment tables (consistent en-GB, no seconds). */
export function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const datePart = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
  const timePart = d.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} ${timePart}`;
}

/** Compact date for tables; shows "Today" / "Yesterday" when applicable. */
export function formatSaleDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = localDateISO(d);
  const today = todayISO();
  if (day === today) return "Today";
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (day === localDateISO(y)) return "Yesterday";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

/** Calendar date in the user's local timezone (YYYY-MM-DD). */
export function localDateISO(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO() {
  return localDateISO();
}
