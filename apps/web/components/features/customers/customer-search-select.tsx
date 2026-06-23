"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, X } from "lucide-react";
import { customersApi } from "@/lib/api";
import { customerDisplayLabel } from "@/lib/customer-label";
import { useDebounce } from "@/hooks/use-debounce";
import { CustomerAvatar } from "@/components/features/customers/customer-initials";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/api";

type CustomerSearchSelectProps = {
  value: string;
  onValueChange: (customerId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function customerSubtitle(c: Customer) {
  const parts: string[] = [];
  if (c.phone) parts.push(c.phone);
  if (c.email) parts.push(c.email);
  return parts.join(" · ");
}

export function CustomerSearchSelect({
  value,
  onValueChange,
  placeholder = "Search customers…",
  disabled,
  className,
}: CustomerSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const isDebouncing = search !== debouncedSearch;

  const { data: selectedCustomer, isLoading: selectedLoading } = useQuery({
    queryKey: ["customers", value],
    queryFn: () => customersApi.get(value),
    enabled: !!value,
  });

  const { data: searchData, isFetching } = useQuery({
    queryKey: ["customers", "search", debouncedSearch],
    queryFn: () =>
      customersApi.list({
        search: debouncedSearch.trim() || undefined,
        limit: 20,
      }),
    enabled: open,
  });

  const results = searchData?.customers ?? [];
  const loadingResults = open && (isFetching || isDebouncing);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setSearch("");
  }

  function handleSelect(customerId: string) {
    onValueChange(customerId);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onValueChange("");
  }

  const triggerLabel = selectedCustomer
    ? customerDisplayLabel(selectedCustomer)
    : null;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-between font-normal",
              !value && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
          {selectedLoading && value ? (
            <>
              <Spinner className="h-4 w-4 shrink-0" />
              <span>Loading…</span>
            </>
          ) : triggerLabel ? (
            <>
              <CustomerAvatar name={selectedCustomer!.name} className="h-6 w-6 text-[10px]" />
              <span className="truncate">{triggerLabel}</span>
            </>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-0.5">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              className="rounded-sm p-0.5 hover:bg-muted"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onValueChange("");
                }
              }}
              aria-label="Clear customer"
            >
              <X className="h-3.5 w-3.5 opacity-60" />
            </span>
          )}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--anchor-width) p-0"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Name or phone…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loadingResults ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
                Searching…
              </div>
            ) : results.length === 0 ? (
              <CommandEmpty>
                {debouncedSearch.trim()
                  ? `No customers for "${debouncedSearch.trim()}".`
                  : "No customers yet. Add one from Customers."}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((c) => {
                  const subtitle = customerSubtitle(c);
                  return (
                    <CommandItem
                      key={c.id}
                      value={c.id}
                      onSelect={() => handleSelect(c.id)}
                      className="gap-2"
                    >
                      <CustomerAvatar name={c.name} className="h-7 w-7 text-[10px]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {customerDisplayLabel(c)}
                        </p>
                        {subtitle && (
                          <p className="truncate text-xs text-muted-foreground">
                            {subtitle}
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
