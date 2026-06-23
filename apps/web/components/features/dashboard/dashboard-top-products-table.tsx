"use client";

import { formatMoney } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SaleTopItem } from "@/types/api";

type DashboardTopProductsTableProps = {
  items: SaleTopItem[];
  currency: string;
};

export function DashboardTopProductsTable({
  items,
  currency,
}: DashboardTopProductsTableProps) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        Top sellers appear here after you record sales in this period.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs">Product</TableHead>
            <TableHead className="text-xs text-right">Qty</TableHead>
            <TableHead className="text-xs text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.slice(0, 8).map((item, i) => (
            <TableRow key={`${item.description}-${i}`}>
              <TableCell>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold uppercase text-muted-foreground">
                    {item.description.slice(0, 2)}
                  </div>
                  <span className="font-medium truncate text-sm">{item.description}</span>
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                {item.quantity}
              </TableCell>
              <TableCell className="text-right tabular-nums text-sm font-semibold">
                {formatMoney(item.revenue, currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
