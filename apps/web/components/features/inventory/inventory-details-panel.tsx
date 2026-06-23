"use client";

import Link from "next/link";
import { ExternalLink, Package, Truck, Wrench } from "lucide-react";
import type { InventoryItem } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryItemPhoto } from "@/components/features/inventory/inventory-item-photo";
import { cn } from "@/lib/utils";

function DetailRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("border-b last:border-0", className)}>
      <th className="py-2.5 pr-4 text-left text-xs font-medium text-muted-foreground align-top w-[38%]">
        {label}
      </th>
      <td className="py-2.5 text-sm align-top">{children}</td>
    </tr>
  );
}

export function InventoryDetailsPanel({ item }: { item: InventoryItem }) {
  const isProduct = item.type === "product";

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full bg-muted/30">
        <InventoryItemPhoto
          src={item.photo_url}
          name={item.name}
          type={item.type}
          iconClassName="h-16 w-16"
        />
      </div>

      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-sm flex items-center gap-2">
          {isProduct ? <Package className="h-4 w-4 text-primary" /> : <Wrench className="h-4 w-4 text-primary" />}
          {isProduct ? "Product details" : "Service details"}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 pb-0">
        <table className="w-full text-sm">
          <tbody>
            <DetailRow label="Name">
              <span className="font-medium">{item.name}</span>
            </DetailRow>
            <DetailRow label="Type">
              <span className="capitalize">{item.type}</span>
            </DetailRow>
            <DetailRow label="Status">
              <Badge
                className={cn(
                  "text-xs border-0",
                  item.status === "active"
                    ? "bg-primary/10 text-primary"
                    : item.status === "discontinued"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {item.status}
              </Badge>
            </DetailRow>
            {item.category ? (
              <DetailRow label="Category">
                <span>{item.category}</span>
              </DetailRow>
            ) : null}
            {item.sku ? (
              <DetailRow label="SKU">
                <span className="font-mono text-xs">{item.sku}</span>
              </DetailRow>
            ) : null}
            {item.barcode ? (
              <DetailRow label="Barcode">
                <span className="font-mono text-xs">{item.barcode}</span>
              </DetailRow>
            ) : null}
            {isProduct && item.unit ? (
              <DetailRow label="Unit">
                <span>{item.unit}</span>
              </DetailRow>
            ) : null}
            {isProduct && item.costing_method ? (
              <DetailRow label="Costing">
                <span className="uppercase">{item.costing_method}</span>
              </DetailRow>
            ) : null}
            {isProduct && item.low_stock_threshold > 0 ? (
              <DetailRow label="Low stock alert">
                <span>
                  {item.low_stock_threshold} {item.unit || "units"}
                </span>
              </DetailRow>
            ) : null}
            {!isProduct && item.duration_mins ? (
              <DetailRow label="Duration">
                <span>{item.duration_mins} min</span>
              </DetailRow>
            ) : null}
            <DetailRow label="Storefront">
              <span>{item.storefront_visible ? "Visible on shop" : "Hidden from shop"}</span>
            </DetailRow>
            {item.tags?.length > 0 ? (
              <DetailRow label="Tags">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {t}
                    </span>
                  ))}
                </div>
              </DetailRow>
            ) : null}
            {item.description?.trim() ? (
              <DetailRow label="Description">
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </DetailRow>
            ) : null}
          </tbody>
        </table>

        {item.supplier_name ? (
          <div className="border-t mt-2 px-4 py-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Supplier
            </p>
            <p className="font-medium text-sm">{item.supplier_name}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              nativeButton={false}
              render={<Link href="/inventory/suppliers" />}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View suppliers
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
