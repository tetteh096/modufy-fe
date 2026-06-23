"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Phone,
  Mail,
  FileText,
  ShoppingCart,
  Building2,
  UserCircle,
  Hash,
} from "lucide-react";
import { customersApi } from "@/lib/api";
import { formatMoney, formatDate } from "@/lib/format";
import { customerTypeLabel } from "@/lib/customer-label";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiCustomerBriefSheet } from "@/components/features/ai/ai-customer-brief-sheet";

const typeIcons: Record<string, React.ElementType> = {
  invoice: FileText,
  payment: FileText,
  sale: ShoppingCart,
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customersApi.get(id),
    enabled: !!id,
  });

  if (isLoading || !customer) {
    return <SectionLoader />;
  }

  const currency = customer.preferred_currency || "GHS";
  const isCompany = customer.customer_type === "company";

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={customer.name}
        description={
          isCompany && customer.contact_name
            ? `Company · contact: ${customer.contact_name}`
            : "Customer profile and activity"
        }
        action={
          <div className="flex gap-2">
            <AiCustomerBriefSheet customerId={id} customerName={customer.name} />
            <Button
              render={<Link href={`/customers/${id}/edit`} />}
              size="sm"
              className="gap-1.5"
            >
              Edit
            </Button>
            <Button render={<Link href="/customers" />} variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {isCompany ? (
                <Building2 className="h-3 w-3 mr-1 inline" />
              ) : null}
              {customerTypeLabel(customer.customer_type ?? "individual")}
            </Badge>
            {customer.total_owed > 0 && (
              <Badge variant="destructive">
                Owes {formatMoney(customer.total_owed, currency)}
              </Badge>
            )}
            {customer.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          {isCompany && customer.contact_name && (
            <p className="flex items-center gap-1.5 text-sm">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{customer.contact_name}</span>
              <span className="text-muted-foreground">— primary contact</span>
            </p>
          )}
          {isCompany && customer.tax_id && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Hash className="h-4 w-4 shrink-0" />
              {customer.tax_id}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {customer.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {customer.phone}
              </span>
            )}
            {customer.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {customer.email}
              </span>
            )}
          </div>
          {customer.address && <p className="text-sm">{customer.address}</p>}
          {customer.notes && (
            <p className="text-sm text-muted-foreground border-t pt-3">{customer.notes}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No activity yet — invoices, payments, and sales will appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {customer.timeline.map((event) => {
                const Icon = typeIcons[event.type] ?? FileText;
                return (
                  <li
                    key={`${event.type}-${event.id}`}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="rounded-md bg-muted p-2 shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(event.occurred_at)} · {event.status}
                      </p>
                    </div>
                    {event.amount > 0 && (
                      <span className="text-sm font-semibold tabular-nums shrink-0">
                        {formatMoney(event.amount, event.currency)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
