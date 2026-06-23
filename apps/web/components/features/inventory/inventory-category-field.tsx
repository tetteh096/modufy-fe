"use client";

import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InventoryCategoryField({
  itemType,
  value,
  onChange,
  id = "category",
  className,
}: {
  itemType: "product" | "service";
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
}) {
  const { data } = useQuery({
    queryKey: ["inventory-categories", itemType],
    queryFn: () => inventoryApi.listCategories(itemType),
  });

  const categories = data?.categories ?? [];
  const listId = `${id}-suggestions`;

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        id={id}
        className="h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list={listId}
        placeholder={itemType === "product" ? "Pick or type a category…" : "Pick or type a service category…"}
      />
      <datalist id={listId}>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name} />
        ))}
      </datalist>
      {categories.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.name)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                value === cat.name
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Type a category or pick one after categories are added.</p>
      )}
    </div>
  );
}
