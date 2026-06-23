"use client";

import Link from "next/link";
import {
  ChevronDown,
  Eye,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MarketplaceOrder, OrderStatus } from "@/types/api";
import { formatDateTime, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ORDER_NEXT_STATUSES,
  ORDER_STATUS_CONFIG,
  orderItemsSummary,
} from "@/components/features/marketplace/marketplace-order-status";

type MarketplaceOrdersTableProps = {
  orders: MarketplaceOrder[];
  onView: (order: MarketplaceOrder) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onCreateCustomer: (orderId: string) => void;
  statusPendingId?: string | null;
  customerPendingId?: string | null;
};

export function MarketplaceOrdersTable({
  orders,
  onView,
  onStatusChange,
  onCreateCustomer,
  statusPendingId,
  customerPendingId,
}: MarketplaceOrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden md:table-cell">Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden lg:table-cell">Date</TableHead>
          <TableHead className="w-[72px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const cfg = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.received;
          const next = ORDER_NEXT_STATUSES[order.status] ?? [];
          const statusBusy = statusPendingId === order.id;
          const customerBusy = customerPendingId === order.id;

          return (
            <TableRow
              key={order.id}
              className="cursor-pointer"
              onClick={() => onView(order)}
            >
              <TableCell>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{order.guest_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.guest_phone || "No phone"}
                  </p>
                  {order.customer_id ? (
                    <Link
                      href={`/customers/${order.customer_id}`}
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View customer
                    </Link>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[220px]">
                <p className="text-sm text-muted-foreground truncate">
                  {orderItemsSummary(order.lines)}
                </p>
              </TableCell>
              <TableCell>
                <div>
                  {order.discount_amount > 0 ? (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatMoney(order.subtotal, order.currency)}
                    </p>
                  ) : null}
                  <p className="font-semibold text-sm tabular-nums">
                    {formatMoney(order.total, order.currency)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={cn("text-xs font-medium border-0", cfg.className)}>
                  {cfg.label}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground whitespace-nowrap">
                {formatDateTime(order.created_at)}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Order actions</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(order)}>
                      <Eye className="h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    {!order.customer_id && order.guest_phone ? (
                      <DropdownMenuItem
                        disabled={customerBusy}
                        onClick={() => onCreateCustomer(order.id)}
                      >
                        <UserPlus className="h-4 w-4" />
                        Add to customers
                      </DropdownMenuItem>
                    ) : null}
                    {next.length > 0 ? (
                      <>
                        <DropdownMenuSeparator />
                        {next.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            disabled={statusBusy}
                            onClick={() => onStatusChange(order.id, status)}
                          >
                            Move to {ORDER_STATUS_CONFIG[status].label}
                            <ChevronDown className="h-3 w-3 opacity-0" />
                          </DropdownMenuItem>
                        ))}
                      </>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
