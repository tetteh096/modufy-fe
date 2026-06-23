export type OrdersQueryFilters = {
  search?: string;
  from?: string;
  to?: string;
};

export function ordersListParams(filters: OrdersQueryFilters) {
  return {
    search: filters.search?.trim() || undefined,
    from: filters.from,
    to: filters.to,
  };
}
