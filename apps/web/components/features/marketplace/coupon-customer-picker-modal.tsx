"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Phone, Search, Users } from "lucide-react";
import { customersApi } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { ListPagination } from "@/components/shared/list-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/api";

const PAGE_SIZE = 12;

function customerLabel(c: Customer) {
  return c.display_name?.trim() || c.name?.trim() || "Customer";
}

function CustomerPickCard({
  customer,
  selected,
  onToggle,
}: {
  customer: Customer;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted/50",
        selected && "border-primary bg-primary/5 ring-1 ring-primary/20",
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Users className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm leading-snug truncate">{customerLabel(customer)}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Phone className="h-3 w-3 shrink-0" />
          {customer.phone}
        </p>
        {customer.email ? (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{customer.email}</p>
        ) : null}
      </div>
      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
          selected ? "border-primary bg-primary text-primary-foreground" : "bg-background",
        )}
      >
        {selected ? <Check className="h-3 w-3" /> : null}
      </div>
    </button>
  );
}

export function CouponCustomerPickerModal({
  open,
  onOpenChange,
  selectedIds,
  onChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [draftIds, setDraftIds] = useState<string[]>(selectedIds);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (open) setDraftIds(selectedIds);
  }, [open, selectedIds]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["coupon-customer-picker", debouncedSearch, page],
    queryFn: () =>
      customersApi.list({
        search: debouncedSearch || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    enabled: open,
  });

  const items = (data?.customers ?? []).filter((c) => c.phone?.trim());
  const total = data?.total ?? 0;

  function toggle(id: string) {
    setDraftIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function selectAllOnPage() {
    const pageIds = items.map((c) => c.id);
    setDraftIds((prev) => [...new Set([...prev, ...pageIds])]);
  }

  function clearAll() {
    setDraftIds([]);
  }

  function confirm() {
    onChange(draftIds);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,52rem)] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b px-6 py-4 text-left">
          <DialogTitle className="text-lg">Choose eligible customers</DialogTitle>
          <DialogDescription>
            Restricted coupons only work when the customer&apos;s checkout phone matches someone you select here.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email…"
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={selectAllOnPage} disabled={items.length === 0}>
              Select page
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearAll} disabled={draftIds.length === 0}>
              Clear all
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Users className="mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm font-medium">No customers with phone numbers found</p>
              <p className="mt-1 text-xs">Add customers with a phone number before creating restricted coupons.</p>
            </div>
          ) : (
            <div className={cn(isFetching && !isLoading && "opacity-60 transition-opacity")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((customer) => (
                  <CustomerPickCard
                    key={customer.id}
                    customer={customer}
                    selected={draftIds.includes(customer.id)}
                    onToggle={() => toggle(customer.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-2">
          <ListPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            itemLabel="customer"
          />
        </div>

        <DialogFooter className="border-t px-6 py-4 sm:justify-between">
          <p className="text-sm text-muted-foreground tabular-nums">
            <span className="font-semibold text-foreground">{draftIds.length}</span> customer
            {draftIds.length === 1 ? "" : "s"} selected
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirm}>
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
