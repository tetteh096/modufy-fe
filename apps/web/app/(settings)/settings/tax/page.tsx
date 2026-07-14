"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Receipt, FileText, BarChart3 } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsField } from "@/components/features/settings/settings-field";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import {
  taxSchema,
  businessToTax,
  type TaxForm,
} from "@/components/features/settings/settings-shared";
import { VsdcSection } from "@/components/features/settings/vsdc-section";
import { cn } from "@/lib/utils";

function taxIdHint(country: string) {
  if (country === "NG") {
    return "Your FIRS Tax Identification Number — shown on invoices and VAT returns";
  }
  return "Your GRA Tax Identification Number (TIN) — shown on invoices and VAT returns";
}

function taxIdPlaceholder(country: string) {
  if (country === "NG") return "e.g. 12345678-0001";
  return "e.g. C0001234567";
}

function VatRegistrationToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-all",
        checked
          ? "border-primary/35 bg-primary/[0.04] shadow-xs"
          : "border-border/70 bg-muted/10 hover:border-border hover:bg-muted/20",
      )}
    >
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium">Business is VAT registered</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Enable VAT lines on invoices and include your business in tax reporting
        </p>
      </div>
      <span
        aria-hidden
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors",
          checked ? "border-primary/40 bg-primary" : "border-border/80 bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

function TaxImpactPreview({ vatRegistered }: { vatRegistered: boolean }) {
  const items = [
    {
      icon: FileText,
      label: "Invoices",
      on: "VAT, NHIL & GETFund lines on Ghana invoices",
      off: "Simple totals without tax breakdown",
    },
    {
      icon: BarChart3,
      label: "Accounts",
      on: "VAT summary and return reports",
      off: "Basic income reports only",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(({ icon: Icon, label, on, off }) => (
        <div
          key={label}
          className="rounded-lg border border-border/60 bg-muted/15 px-3.5 py-3"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-medium">{label}</p>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {vatRegistered ? on : off}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function TaxSettingsPage() {
  const queryClient = useQueryClient();
  const { data: business, isLoading } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm<TaxForm>({
    resolver: zodResolver(taxSchema),
  });

  const vatRegistered = watch("vat_registered");

  useEffect(() => {
    if (business) reset(businessToTax(business));
  }, [business, reset]);

  const updateMutation = useMutation({
    mutationFn: businessApi.update,
    onSuccess: (updated) => {
      toast.success("Tax settings saved");
      queryClient.setQueryData(["business"], updated);
      reset(businessToTax(updated));
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onSubmit(data: TaxForm) {
    updateMutation.mutate({
      vat_registered: data.vat_registered,
      tax_id: data.tax_id,
    });
  }

  if (isLoading || !business) return <SectionLoader />;

  const country = business.country || "GH";
  const showVsdc = country === "GH";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <PageHeader
        title="Tax & VAT"
        description="For Ghana (GRA) and Nigeria (FIRS) tax reporting"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <SettingsSection
          title="VAT registration"
          icon={Receipt}
          description="Tell Modufy whether you charge and report VAT"
        >
          <VatRegistrationToggle
            checked={!!vatRegistered}
            onChange={(value) => setValue("vat_registered", value, { shouldDirty: true })}
          />

          {vatRegistered && (
            <SettingsField
              label="Tax ID"
              htmlFor="tax_id"
              hint={taxIdHint(country)}
            >
              <Input
                id="tax_id"
                className="h-10 font-mono text-sm"
                placeholder={taxIdPlaceholder(country)}
                {...register("tax_id")}
              />
            </SettingsField>
          )}

          <TaxImpactPreview vatRegistered={!!vatRegistered} />
        </SettingsSection>

        <SettingsStickyFooter>
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty}
            onClick={() => reset(businessToTax(business))}
          >
            Discard
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting || updateMutation.isPending}>
            {(isSubmitting || updateMutation.isPending) && (
              <Spinner className="mr-2 h-4 w-4" />
            )}
            Save changes
          </Button>
        </SettingsStickyFooter>
      </form>

      {showVsdc ? (
        <VsdcSection configured={business.vsdc_configured} />
      ) : (
        <SettingsSection
          title="E-invoicing"
          icon={Receipt}
          description="Country-specific electronic tax submission"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            GRA E-VAT (VSDC) connection is available for Ghana-based businesses. Update your
            country under Settings → General if this business is registered in Ghana.
          </p>
        </SettingsSection>
      )}
    </div>
  );
}
