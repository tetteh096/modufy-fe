import type { InventoryItem } from "@/types/api";

export type ProductSortKey =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "stock_asc"
  | "stock_desc";

export type ProductStockFilter = "all" | "low" | "out" | "in_stock";

export const PRODUCT_SORT_OPTIONS: { value: ProductSortKey; label: string }[] = [
  { value: "name_asc", label: "Name A → Z" },
  { value: "name_desc", label: "Name Z → A" },
  { value: "price_asc", label: "Price low → high" },
  { value: "price_desc", label: "Price high → low" },
  { value: "stock_asc", label: "Stock low → high" },
  { value: "stock_desc", label: "Stock high → low" },
];

export const PRODUCT_STOCK_FILTER_OPTIONS: { value: ProductStockFilter; label: string }[] = [
  { value: "all", label: "All stock" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
  { value: "in_stock", label: "In stock" },
];

export function filterProductsByStock(
  items: InventoryItem[],
  filter: ProductStockFilter,
): InventoryItem[] {
  switch (filter) {
    case "low":
      return items.filter((item) => item.is_low_stock);
    case "out":
      return items.filter((item) => item.stock_qty <= 0);
    case "in_stock":
      return items.filter((item) => item.stock_qty > 0);
    default:
      return items;
  }
}

export function sortProducts(items: InventoryItem[], sort: ProductSortKey): InventoryItem[] {
  const sorted = [...items];
  switch (sort) {
    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "price_asc":
      return sorted.sort((a, b) => a.sell_price - b.sell_price);
    case "price_desc":
      return sorted.sort((a, b) => b.sell_price - a.sell_price);
    case "stock_asc":
      return sorted.sort((a, b) => a.stock_qty - b.stock_qty);
    case "stock_desc":
      return sorted.sort((a, b) => b.stock_qty - a.stock_qty);
    case "name_asc":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function paginateItems<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
