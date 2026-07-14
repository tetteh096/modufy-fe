"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { LogoBrandSection } from "@/components/features/settings/logo-brand-section";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import {
  brandingSchema,
  businessToBranding,
  type BrandingForm,
} from "@/components/features/settings/settings-shared";

export default function BrandingSettingsPage() {
  const queryClient = useQueryClient();
  const { data: business, isLoading } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  const [brandColorLocal, setBrandColorLocal] = useState("#1E40AF");

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<BrandingForm>({
    resolver: zodResolver(brandingSchema),
  });

  useEffect(() => {
    if (business) {
      reset(businessToBranding(business));
      setBrandColorLocal(business.brand_color || "#1E40AF");
    }
  }, [business, reset]);

  const updateMutation = useMutation({
    mutationFn: businessApi.update,
    onSuccess: (updated) => {
      toast.success("Branding saved");
      queryClient.setQueryData(["business"], updated);
      reset(businessToBranding(updated));
      setBrandColorLocal(updated.brand_color || "#1E40AF");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onSubmit(data: BrandingForm) {
    updateMutation.mutate({
      brand_color: data.brand_color || "#1E40AF",
    });
  }

  if (isLoading || !business) return <SectionLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <PageHeader
        title="Branding"
        description="Logo and colour on invoices, storefront, and customer-facing pages"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <LogoBrandSection
          business={business}
          brandColor={brandColorLocal}
          onBrandColorChange={(c) => {
            setBrandColorLocal(c);
            setValue("brand_color", c, { shouldDirty: true });
          }}
        />

        <SettingsStickyFooter>
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty}
            onClick={() => {
              reset(businessToBranding(business));
              setBrandColorLocal(business.brand_color || "#1E40AF");
            }}
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
    </div>
  );
}
