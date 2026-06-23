import type { OrderStatus } from "@/types/api";

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  received: {
    label: "Received",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  dispatched: {
    label: "Dispatched",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  delivered: {
    label: "Delivered",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export const ORDER_NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  received: ["confirmed", "cancelled"],
  confirmed: ["dispatched", "cancelled"],
  dispatched: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function orderItemsSummary(
  lines: { qty: number; product_name: string }[],
  max = 2,
) {
  const head = lines.slice(0, max).map((l) => `${l.qty}× ${l.product_name}`);
  const rest = lines.length - max;
  if (rest > 0) head.push(`+${rest} more`);
  return head.join(", ");
}
