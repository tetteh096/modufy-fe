"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Ban, Globe, Mail, MapPin, ShieldCheck, User } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";
import {
  BusinessWorkspacePageHeader,
} from "@/components/features/admin/business-workspace-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessOverviewPage() {
  const { businessId, business } = useBusinessWorkspace();
  const qc = useQueryClient();

  const updateFlags = useMutation({
    mutationFn: (body: { verified?: boolean; suspended?: boolean }) =>
      adminApi.updateBusiness(businessId, body),
    onSuccess: () => {
      toast.success("Business updated");
      qc.invalidateQueries({ queryKey: ["admin-business", businessId] });
      qc.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (!business) return null;

  const stats = [
    { label: "Sales (30d)", value: String(business.stats.sales_count_30d) },
    { label: "GMV (30d)", value: formatMoney(business.stats.sales_total_30d) },
    { label: "Invoices", value: String(business.stats.invoice_count) },
    { label: "Customers", value: String(business.stats.customer_count) },
    { label: "Open tickets", value: String(business.stats.open_ticket_count) },
    { label: "Team members", value: String(business.users.length) },
  ];

  return (
    <div>
      <BusinessWorkspacePageHeader
        title="Overview"
        description="Profile, activity snapshot, and account controls."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={business.verified ? "default" : "outline"}
              disabled={updateFlags.isPending}
              onClick={() => updateFlags.mutate({ verified: !business.verified })}
            >
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              {business.verified ? "Verified" : "Mark verified"}
            </Button>
            <Button
              size="sm"
              variant={business.suspended ? "destructive" : "outline"}
              disabled={updateFlags.isPending}
              onClick={() => updateFlags.mutate({ suspended: !business.suspended })}
            >
              <Ban className="mr-1 h-3.5 w-3.5" />
              {business.suspended ? "Suspended" : "Suspend"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {stats.map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ProfileRow icon={User} label="Owner" value={`${business.owner_name} · ${business.owner_email}`} />
            <ProfileRow icon={Globe} label="Country" value={business.country} />
            {business.city && <ProfileRow icon={MapPin} label="City" value={business.city} />}
            <ProfileRow icon={Mail} label="Category" value={business.category || "—"} />
            <div className="flex items-start gap-3 pt-1">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">Status</span>
              <div className="flex flex-wrap gap-1.5">
                {business.verified && <Badge className="bg-primary/10 text-primary">Verified</Badge>}
                {business.suspended && <Badge variant="destructive">Suspended</Badge>}
                {!business.verified && !business.suspended && (
                  <Badge variant="outline">Standard</Badge>
                )}
              </div>
            </div>
            <ProfileRow
              label="Joined"
              value={new Date(business.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Storefront & billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Public slug</p>
              <p className="mt-0.5 font-mono text-xs">/p/{business.slug}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Enabled modules</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {business.modules_enabled.length === 0 ? (
                  <span className="text-muted-foreground">Core only</span>
                ) : (
                  business.modules_enabled.map((m) => (
                    <Badge key={m} variant="secondary" className="text-[10px] capitalize">
                      {m}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-lg border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">
              Subscription billing and payment history will appear here when merchant billing is connected.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      ) : (
        <span className="w-4 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}
