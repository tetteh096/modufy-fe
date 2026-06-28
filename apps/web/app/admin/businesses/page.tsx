"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, ChevronRight, Globe, Package, CheckCircle2, XCircle } from "lucide-react";
import { apiClient, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ApiResponse } from "@/types/api";

interface BusinessItem {
  id: string;
  name: string;
  slug: string;
  country: string;
  category: string;
  owner_email: string;
  modules_enabled: string[];
  created_at: string;
}

interface ModuleItem {
  module: string;
  enabled: boolean;
}

const ALL_MODULES = [
  { key: "invoices",     label: "Invoices",      description: "Invoicing & VAT" },
  { key: "inventory",    label: "Inventory",     description: "Products & stock" },
  { key: "appointments", label: "Appointments",  description: "Bookings & schedule" },
  { key: "accounts",     label: "Accounts",      description: "P&L & tax reports" },
  { key: "marketplace",  label: "Marketplace",   description: "Storefront & directory" },
  { key: "blog",         label: "Blog",          description: "SEO blog & articles" },
  { key: "pos",          label: "POS",           description: "In-store register" },
];

function ModuleToggleRow({
  mod,
  businessId,
  enabled,
}: {
  mod: (typeof ALL_MODULES)[number];
  businessId: string;
  enabled: boolean;
}) {
  const qc = useQueryClient();
  const toggle = useMutation({
    mutationFn: (next: boolean) =>
      apiClient.patch(`/admin/businesses/${businessId}/modules/${mod.key}`, { enabled: next }),
    onSuccess: (_, next) => {
      toast.success(`${mod.label} ${next ? "enabled" : "disabled"}`);
      qc.invalidateQueries({ queryKey: ["admin-modules", businessId] });
      qc.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{mod.label}</p>
        <p className="text-xs text-muted-foreground">{mod.description}</p>
      </div>
      <Button
        size="sm"
        variant={enabled ? "default" : "outline"}
        className="shrink-0 ml-4 gap-1.5 h-7 text-xs font-medium"
        disabled={toggle.isPending}
        onClick={() => toggle.mutate(!enabled)}
      >
        {enabled ? (
          <><CheckCircle2 className="h-3 w-3" /> On</>
        ) : (
          <><XCircle className="h-3 w-3" /> Off</>
        )}
      </Button>
    </div>
  );
}

function ModulesDialog({ business, open, onClose }: { business: BusinessItem; open: boolean; onClose: () => void }) {
  const { data: modules, isLoading } = useQuery({
    queryKey: ["admin-modules", business.id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ModuleItem[]>>(`/admin/businesses/${business.id}/modules`);
      return res.data.data;
    },
    enabled: open,
  });

  const enabledKeys = new Set(modules?.filter((m) => m.enabled).map((m) => m.module) ?? []);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>{business.name}</DialogTitle>
          <p className="text-xs text-muted-foreground">{business.owner_email}</p>
        </DialogHeader>

        {isLoading ? (
          <SectionLoader className="py-6" />
        ) : (
          <div className="divide-y">
            {ALL_MODULES.map((mod) => (
              <ModuleToggleRow
                key={mod.key}
                mod={mod}
                businessId={business.id}
                enabled={enabledKeys.has(mod.key)}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BusinessRow({ business }: { business: BusinessItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-4 p-4 hover:bg-muted/40 cursor-pointer rounded-lg transition-colors group"
        onClick={() => setOpen(true)}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-sm">
          {business.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{business.name}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />{business.country}
            </span>
            {business.category && (
              <span className="text-xs text-muted-foreground">· {business.category}</span>
            )}
            <span className="text-xs text-muted-foreground truncate">· {business.owner_email}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {business.modules_enabled.length > 0 ? (
            <Badge variant="secondary" className="text-xs gap-1">
              <Package className="h-3 w-3" />
              {business.modules_enabled.length} module{business.modules_enabled.length !== 1 ? "s" : ""}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-muted-foreground">No modules</Badge>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
        </div>
      </div>
      <ModulesDialog business={business} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default function AdminBusinessesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-businesses"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<{ businesses: BusinessItem[]; total: number }>>("/admin/businesses");
      return res.data.data;
    },
  });

  const businesses = data?.businesses ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <PageHeader
        title="Businesses"
        description={total > 0 ? `${total} registered business${total !== 1 ? "es" : ""}` : "All Modufy customers"}
      />
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <EmptyState
              icon={<Building2 className="h-8 w-8" />}
              title="No businesses yet"
              description="When businesses sign up they'll appear here. Click any one to manage their modules."
            />
          ) : (
            <div className="divide-y">
              {businesses.map((b) => <BusinessRow key={b.id} business={b} />)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
