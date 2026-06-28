"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle2, XCircle, Ban, ShieldCheck, RefreshCw, Store, Package,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SupportSessionPanel } from "@/components/features/admin/support-session-panel";
import { BusinessSMSWalletPanel } from "@/components/features/admin/business-sms-wallet-panel";

const MODULES = [
  { key: "invoices", label: "Invoices" },
  { key: "inventory", label: "Inventory" },
  { key: "appointments", label: "Appointments" },
  { key: "accounts", label: "Accounts" },
  { key: "marketplace", label: "Marketplace" },
  { key: "marketing", label: "Marketing" },
  { key: "blog", label: "Blog" },
  { key: "pos", label: "POS" },
  { key: "ai", label: "AI" },
];

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [note, setNote] = useState("");

  const { data: biz, isLoading } = useQuery({
    queryKey: ["admin-business", id],
    queryFn: () => adminApi.business(id),
  });

  const updateFlags = useMutation({
    mutationFn: (body: { verified?: boolean; suspended?: boolean }) =>
      adminApi.updateBusiness(id, body),
    onSuccess: () => {
      toast.success("Business updated");
      qc.invalidateQueries({ queryKey: ["admin-business", id] });
      qc.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const toggleModule = useMutation({
    mutationFn: ({ module, enabled }: { module: string; enabled: boolean }) =>
      adminApi.toggleModule(id, module, enabled),
    onSuccess: (_, { enabled, module }) => {
      toast.success(`${module} ${enabled ? "enabled" : "disabled"}`);
      qc.invalidateQueries({ queryKey: ["admin-business", id] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const addNote = useMutation({
    mutationFn: () => adminApi.addBusinessNote(id, note),
    onSuccess: () => {
      toast.success("Note added");
      setNote("");
      qc.invalidateQueries({ queryKey: ["admin-business", id] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading || !biz) {
    return <SectionLoader className="py-16" />;
  }

  const moduleMap = new Map(biz.modules.map((m) => [m.module, m]));

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" render={<Link href="/businesses" />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Businesses
        </Button>
      </div>

      <PageHeader
        title={biz.name}
        description={`${biz.owner_name} · ${biz.owner_email} · ${biz.country}${biz.city ? `, ${biz.city}` : ""}`}
        action={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={biz.verified ? "default" : "outline"}
              disabled={updateFlags.isPending}
              onClick={() => updateFlags.mutate({ verified: !biz.verified })}
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              {biz.verified ? "Verified" : "Mark verified"}
            </Button>
            <Button
              size="sm"
              variant={biz.suspended ? "destructive" : "outline"}
              disabled={updateFlags.isPending}
              onClick={() => updateFlags.mutate({ suspended: !biz.suspended })}
            >
              <Ban className="h-3.5 w-3.5 mr-1" />
              {biz.suspended ? "Suspended" : "Suspend"}
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Activity (30 days)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Sales</p>
                <p className="font-semibold">{biz.stats.sales_count_30d}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Sales total</p>
                <p className="font-semibold">{biz.stats.sales_total_30d.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Invoices</p>
                <p className="font-semibold">{biz.stats.invoice_count}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Customers</p>
                <p className="font-semibold">{biz.stats.customer_count}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Modules</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {MODULES.map((mod) => {
                const item = moduleMap.get(mod.key);
                const enabled = item?.enabled ?? false;
                return (
                  <div key={mod.key} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      {mod.key === "pos" ? <Store className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                      <span className="text-sm font-medium">{mod.label}</span>
                    </div>
                    <Button
                      size="sm"
                      variant={enabled ? "default" : "outline"}
                      className="h-7 text-xs min-w-[72px]"
                      disabled={toggleModule.isPending}
                      onClick={() => toggleModule.mutate({ module: mod.key, enabled: !enabled })}
                    >
                      {toggleModule.isPending ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : enabled ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> On</>
                      ) : (
                        <><XCircle className="h-3 w-3 mr-1" /> Off</>
                      )}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Team</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {biz.users.map((u) => (
                <div key={u.id} className="py-2 flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge variant="secondary">{u.role || "—"}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <SupportSessionPanel businessId={id} />
          <BusinessSMSWalletPanel businessId={id} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Internal notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                className={cn(
                  "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs",
                  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                )}
                placeholder="Add a note for the team…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <Button
                size="sm"
                className="w-full"
                disabled={!note.trim() || addNote.isPending}
                onClick={() => addNote.mutate()}
              >
                Save note
              </Button>
              <Separator />
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {biz.notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No notes yet.</p>
                ) : (
                  biz.notes.map((n) => (
                    <div key={n.id} className="text-sm">
                      <p className="text-xs text-muted-foreground">
                        {n.author_name} · {new Date(n.created_at).toLocaleString()}
                      </p>
                      <p className="mt-0.5">{n.body}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Storefront</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="text-muted-foreground">Slug</p>
              <p className="font-mono text-xs">/p/{biz.slug}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Open tickets: {biz.stats.open_ticket_count}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
