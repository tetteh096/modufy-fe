"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2, ChevronRight, Globe, Package,
  CheckCircle2, XCircle, Search, RefreshCw, Calendar, Store,
} from "lucide-react";
import { apiClient, getApiErrorMessage } from "@/lib/api";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ApiResponse } from "@/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BusinessItem {
  id: string;
  name: string;
  slug: string;
  country: string;
  category: string;
  owner_email: string;
  modules_enabled: string[];
  verified: boolean;
  suspended: boolean;
  created_at: string;
}

interface ModuleItem {
  module: string;
  enabled: boolean;
  enabled_at?: string;
}

// ─── Module config ────────────────────────────────────────────────────────────

const MODULES = [
  { key: "invoices",     label: "Invoices",     color: "text-blue-500",   description: "Invoice builder, VAT, WhatsApp sending" },
  { key: "inventory",    label: "Inventory",    color: "text-purple-500", description: "Products, stock levels, purchase orders" },
  { key: "appointments", label: "Appointments", color: "text-pink-500",   description: "Booking calendar, deposits, auto-invoice" },
  { key: "accounts",     label: "Accounts",     color: "text-amber-500",  description: "P&L reports, journals, VAT returns" },
  { key: "marketplace",  label: "Marketplace",  color: "text-teal-500",   description: "Public storefront, guest booking, directory" },
  { key: "blog",         label: "Blog",         color: "text-green-600",  description: "SEO blog with rich text editor" },
  { key: "pos",          label: "POS",          color: "text-violet-500", description: "In-store register, receipts, pickup fulfilment" },
  { key: "ai",           label: "AI Assistant", color: "text-fuchsia-500", description: "Drafting, insights, and document AI" },
];

// ─── Module toggle row ────────────────────────────────────────────────────────

function ModuleRow({
  mod, businessId, enabled, enabledAt,
}: {
  mod: (typeof MODULES)[number];
  businessId: string;
  enabled: boolean;
  enabledAt?: string;
}) {
  const qc = useQueryClient();

  const toggle = useMutation({
    mutationFn: (next: boolean) =>
      apiClient.patch(`/admin/businesses/${businessId}/modules/${mod.key}`, { enabled: next }),
    onSuccess: (_, next) => {
      toast.success(`${mod.label} ${next ? "enabled ✓" : "disabled"}`);
      qc.invalidateQueries({ queryKey: ["admin-modules", businessId] });
      qc.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`shrink-0 ${mod.color}`}>
        {mod.key === "pos" ? <Store className="h-4 w-4" /> : <Package className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{mod.label}</p>
        <p className="text-xs text-muted-foreground">{mod.description}</p>
        {enabled && enabledAt && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" />
            Enabled {new Date(enabledAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <Button
        size="sm"
        variant={enabled ? "default" : "outline"}
        className={`shrink-0 h-7 text-xs gap-1.5 min-w-[72px] ${
          enabled ? "bg-primary/90 hover:bg-primary" : ""
        }`}
        disabled={toggle.isPending}
        onClick={() => toggle.mutate(!enabled)}
      >
        {toggle.isPending ? (
          <RefreshCw className="h-3 w-3 animate-spin" />
        ) : enabled ? (
          <><CheckCircle2 className="h-3 w-3" /> On</>
        ) : (
          <><XCircle className="h-3 w-3" /> Off</>
        )}
      </Button>
    </div>
  );
}

// ─── Business detail dialog ───────────────────────────────────────────────────

function BusinessDialog({ business, open, onClose }: { business: BusinessItem; open: boolean; onClose: () => void }) {
  const { data: modules, isLoading } = useQuery({
    queryKey: ["admin-modules", business.id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ModuleItem[]>>(`/admin/businesses/${business.id}/modules`);
      return res.data.data;
    },
    enabled: open,
  });

  const moduleMap = new Map(modules?.map((m) => [m.module, m]) ?? []);
  const enabledCount = modules?.filter((m) => m.enabled).length ?? 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              {business.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base truncate">{business.name}</DialogTitle>
              <p className="text-xs text-muted-foreground">{business.owner_email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{business.country}</Badge>
                {business.category && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{business.category}</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
          <span>Module access</span>
          <span className="font-medium text-foreground">
            {enabledCount}/{MODULES.length} active
          </span>
        </div>

        {isLoading ? (
          <SectionLoader className="py-6" />
        ) : (
          <div className="divide-y -mx-1 px-1">
            {MODULES.map((mod) => {
              const item = moduleMap.get(mod.key);
              return (
                <ModuleRow
                  key={mod.key}
                  mod={mod}
                  businessId={business.id}
                  enabled={item?.enabled ?? false}
                  enabledAt={item?.enabled_at}
                />
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Business row ─────────────────────────────────────────────────────────────

function BusinessRow({ business }: { business: BusinessItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group">
        <Link href={`/businesses/${business.id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
          {business.name.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{business.name}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3 shrink-0" />{business.country}
            </span>
            {business.category && (
              <span className="text-xs text-muted-foreground">· {business.category}</span>
            )}
            <span className="text-xs text-muted-foreground truncate">· {business.owner_email}</span>
            {business.verified && (
              <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-700 border-0">verified</Badge>
            )}
            {business.suspended && (
              <Badge variant="destructive" className="text-[10px] h-4 px-1.5">suspended</Badge>
            )}
          </div>
        </div>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          {business.modules_enabled.length > 0 ? (
            <Badge className="text-xs gap-1 bg-primary/10 text-primary border-0 hover:bg-primary/15">
              <Package className="h-3 w-3" />
              {business.modules_enabled.length} module{business.modules_enabled.length !== 1 ? "s" : ""}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-muted-foreground">Core only</Badge>
          )}
          <span className="text-xs text-muted-foreground hidden lg:block">
            {new Date(business.created_at).toLocaleDateString()}
          </span>
          <Button size="sm" variant="ghost" className="h-8" onClick={() => setOpen(true)}>
            Modules
          </Button>
          <Link href={`/businesses/${business.id}`}>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </Link>
        </div>
      </div>
      <BusinessDialog business={business} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BusinessSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BusinessesPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-businesses", search],
    queryFn: () => adminApi.businesses(search ? { search } : undefined),
  });

  const businesses = data?.businesses ?? [];
  const total = data?.total ?? 0;

  // Stats
  const withModules = (data?.businesses ?? []).filter((b) => b.modules_enabled.length > 0).length;

  return (
    <div>
      <PageHeader
        title="Businesses"
        description="Click any business to manage their paid modules."
      />

      {/* Stats row */}
      {!isLoading && total > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total businesses", value: total },
            { label: "With paid modules", value: withModules },
            { label: "Core only", value: total - withModules },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-4">
                <p className="text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {/* Search bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search businesses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            {total > 0 && (
              <span className="text-xs text-muted-foreground ml-auto shrink-0">
                {search ? `${businesses.length} of ${total}` : `${total} total`}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => <BusinessSkeleton key={i} />)}
            </div>
          ) : businesses.length === 0 ? (
            <EmptyState
              icon={<Building2 className="h-8 w-8" />}
              title={search ? "No businesses match" : "No businesses yet"}
              description={
                search
                  ? `No results for "${search}"`
                  : "Businesses will appear here once they sign up."
              }
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
