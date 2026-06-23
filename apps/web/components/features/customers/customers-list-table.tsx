"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Trash2,
  Eye,
  Pencil,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
} from "lucide-react";
import { formatMoney, formatSaleDate } from "@/lib/format";
import { customerDisplayLabel, customerSourceLabel, customerTypeLabel } from "@/lib/customer-label";
import { CustomerAvatar } from "@/components/features/customers/customer-initials";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Customer } from "@/types/api";

function CustomerTableRow({
  customer,
  onDelete,
}: {
  customer: Customer;
  onDelete: (id: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const currency = customer.preferred_currency || "GHS";
  const isCompany = customer.customer_type === "company";
  const TypeIcon = isCompany ? Building2 : User;

  return (
    <>
      <TableRow className="group">
        <TableCell>
          <Link
            href={`/customers/${customer.id}`}
            className="flex items-center gap-3 min-w-0"
          >
            <CustomerAvatar name={customer.name} />
            <div className="min-w-0">
              <span className="font-medium text-sm hover:text-primary truncate block">
                {customerDisplayLabel(customer)}
              </span>
              <span className="flex items-center gap-1.5 mt-0.5 sm:hidden">
                <Badge variant="outline" className="text-[9px] h-5 px-1.5 font-normal">
                  {customerTypeLabel(customer.customer_type ?? "individual")}
                </Badge>
              </span>
              {isCompany && customer.contact_name && (
                <span className="text-[10px] text-muted-foreground truncate block">
                  Contact: {customer.contact_name}
                </span>
              )}
            </div>
          </Link>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <Badge variant="outline" className="text-[10px] font-normal gap-1">
            <TypeIcon className="h-3 w-3" />
            {customerTypeLabel(customer.customer_type ?? "individual")}
          </Badge>
        </TableCell>
        <TableCell className="hidden xl:table-cell">
          <Badge
            variant={customer.source === "website" ? "default" : "secondary"}
            className="text-[10px] font-normal"
          >
            {customerSourceLabel(customer.source)}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="space-y-0.5 text-sm text-muted-foreground">
            {customer.phone ? (
              <a
                href={`tel:${customer.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate max-w-[160px]">{customer.phone}</span>
              </a>
            ) : (
              <span className="text-xs">No phone</span>
            )}
            {customer.email ? (
              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-1.5 hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate max-w-[200px]">{customer.email}</span>
              </a>
            ) : !customer.phone ? (
              <span className="text-xs">No email</span>
            ) : null}
          </div>
        </TableCell>
        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px]">
          {customer.address ? (
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {customer.address}
            </span>
          ) : (
            <span className="text-xs">—</span>
          )}
        </TableCell>
        <TableCell className="text-right whitespace-nowrap">
          {customer.total_owed > 0 ? (
            <Badge variant="destructive" className="tabular-nums font-normal">
              {formatMoney(customer.total_owed, currency)}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Clear</span>
          )}
        </TableCell>
        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
          {customer.last_transaction_at
            ? formatSaleDate(customer.last_transaction_at)
            : "—"}
        </TableCell>
        <TableCell className="w-10">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href={`/customers/${customer.id}`} />}>
                <Eye className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href={`/customers/${customer.id}/edit`} />}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes <strong>{customer.name}</strong> and cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
              onClick={() => {
                setDeleteOpen(false);
                onDelete(customer.id);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

type CustomersListTableProps = {
  customers: Customer[];
  onDelete: (id: string) => void;
};

export function CustomersListTable({ customers, onDelete }: CustomersListTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead className="hidden xl:table-cell">Source</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden lg:table-cell">Address</TableHead>
            <TableHead className="text-right">Balance due</TableHead>
            <TableHead className="hidden sm:table-cell">Last activity</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <CustomerTableRow
              key={customer.id}
              customer={customer}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
