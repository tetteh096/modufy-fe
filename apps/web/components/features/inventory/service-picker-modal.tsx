"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Scissors, Search } from "lucide-react";
import { inventoryApi } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { useDebounce } from "@/hooks/use-debounce";
import { InventoryItemPhoto } from "@/components/features/inventory/inventory-item-photo";
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
import type { InventoryItem } from "@/types/api";

const PAGE_SIZE = 12;

function ServicePickCard({
  service,
  selected,
  onSelect,
}: {
  service: InventoryItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted/50",
        selected && "border-primary bg-primary/5 ring-1 ring-primary/20",
      )}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
        <InventoryItemPhoto
          src={service.photo_url}
          name={service.name}
          type="service"
          iconClassName="h-5 w-5 text-muted-foreground"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm leading-snug line-clamp-2">{service.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {service.category || "Uncategorised"}
          {service.duration_mins ? ` · ${service.duration_mins} min` : ""}
        </p>
        <p className="mt-1 text-sm font-semibold tabular-nums">
          {formatMoney(service.sell_price, service.currency)}
        </p>
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

export function ServicePickerModal({
  open,
  onOpenChange,
  value,
  onSelect,
  bookableOnly = true,
  title = "Choose a service",
  description = "Search your service catalog. Only bookable services are shown when booking appointments.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string;
  onSelect: (service: InventoryItem) => void;
  bookableOnly?: boolean;
  title?: string;
  description?: string;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [draftId, setDraftId] = useState(value ?? "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (open) setDraftId(value ?? "");
  }, [open, value]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["service-picker", debouncedSearch, page, bookableOnly],
    queryFn: () =>
      inventoryApi.list({
        type: "service",
        status: "active",
        search: debouncedSearch || undefined,
        is_bookable: bookableOnly ? true : undefined,
        page,
        limit: PAGE_SIZE,
      }),
    enabled: open,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const selectedItem = items.find((s) => s.id === draftId);

  function confirm() {
    if (!selectedItem) return;
    onSelect(selectedItem);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,52rem)] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b px-6 py-4 text-left">
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="border-b px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or category…"
              className="pl-9"
              autoFocus
            />
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
              <Scissors className="mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm font-medium">No services found</p>
              <p className="mt-1 text-xs">
                {bookableOnly
                  ? "Mark services as bookable in Inventory, or try another search."
                  : "Try another search or add services in Inventory."}
              </p>
            </div>
          ) : (
            <div className={cn(isFetching && !isLoading && "opacity-60 transition-opacity")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((service) => (
                  <ServicePickCard
                    key={service.id}
                    service={service}
                    selected={draftId === service.id}
                    onSelect={() => setDraftId(service.id)}
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
            itemLabel="service"
          />
        </div>

        <DialogFooter className="border-t px-6 py-4 sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedItem ? (
              <>
                Selected: <span className="font-medium text-foreground">{selectedItem.name}</span>
              </>
            ) : (
              "Select a service to continue"
            )}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirm} disabled={!draftId}>
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
