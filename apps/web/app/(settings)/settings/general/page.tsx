"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, MapPin, Phone } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsField } from "@/components/features/settings/settings-field";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import {
  businessProfileSchema,
  businessToProfile,
  CATEGORIES,
  COUNTRIES,
  type BusinessProfileForm,
} from "@/components/features/settings/settings-shared";
import { LocationPicker } from "@/components/shared/location-picker";
import { hasValidCoords } from "@/lib/geo";

export default function GeneralSettingsPage() {
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
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
  });

  useEffect(() => {
    if (business) reset(businessToProfile(business));
  }, [business, reset]);

  const updateMutation = useMutation({
    mutationFn: businessApi.update,
    onSuccess: (updated) => {
      toast.success("General settings saved");
      queryClient.setQueryData(["business"], updated);
      reset(businessToProfile(updated));
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const countryCode = watch("country");
  const mapLat = watch("latitude");
  const mapLng = watch("longitude");

  function onSubmit(data: BusinessProfileForm) {
    const pinned = hasValidCoords(data.latitude, data.longitude);
    updateMutation.mutate({
      name: data.name,
      tagline: data.tagline,
      category: data.category,
      country: data.country,
      city: data.city,
      area: data.area,
      location_set: pinned,
      latitude: pinned ? data.latitude! : 0,
      longitude: pinned ? data.longitude! : 0,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email || undefined,
      website: data.website,
    });
  }

  if (isLoading || !business) return <SectionLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <PageHeader
        title="General"
        description="How your business appears to customers and on documents"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <SettingsSection
          title="Business profile"
          icon={Building2}
          description="Name and category shown across Modufy"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <SettingsField
              label="Business name"
              htmlFor="name"
              hint="Appears on invoices, receipts, and your storefront"
              error={errors.name?.message}
              className="lg:col-span-2"
            >
              <Input id="name" className="h-10" {...register("name")} />
            </SettingsField>

            <SettingsField
              label="Tagline"
              htmlFor="tagline"
              hint="A short line under your name — optional"
            >
              <Input
                id="tagline"
                className="h-10"
                placeholder="e.g. Quality fabrics since 2010"
                {...register("tagline")}
              />
            </SettingsField>

            <SettingsField label="Category" hint="Helps customers find you in search">
              <Select
                value={watch("category") || ""}
                onValueChange={(v) => {
                  if (v) setValue("category", v, { shouldDirty: true });
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Location"
          icon={MapPin}
          description="Address details and map pin for your contact page"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <SettingsField label="Country">
              <Select
                value={watch("country")}
                onValueChange={(v) => {
                  if (v) setValue("country", v, { shouldDirty: true });
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>

            <SettingsField label="City" htmlFor="city">
              <Input id="city" className="h-10" placeholder="Accra" {...register("city")} />
            </SettingsField>

            <SettingsField
              label="Area / district"
              htmlFor="area"
              hint="Neighbourhood or landmark customers will recognise"
              className="sm:col-span-2"
            >
              <Input
                id="area"
                className="h-10"
                placeholder="e.g. Osu, Lekki Phase 1"
                {...register("area")}
              />
            </SettingsField>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5">
            <SettingsField
              label="Store location pin"
              hint="Drop a pin on the map or paste coordinates from Google Maps"
            >
              <LocationPicker
                latitude={mapLat}
                longitude={mapLng}
                country={countryCode || business?.country}
                onChange={(lat, lng) => {
                  setValue("latitude", lat, { shouldDirty: true });
                  setValue("longitude", lng, { shouldDirty: true });
                }}
              />
            </SettingsField>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Contact"
          icon={Phone}
          description="How customers can reach you on invoices and your storefront"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <SettingsField label="Phone" htmlFor="phone" hint="Primary business line">
              <Input id="phone" type="tel" className="h-10" {...register("phone")} />
            </SettingsField>

            <SettingsField
              label="WhatsApp"
              htmlFor="whatsapp"
              hint="Include country code, e.g. +233…"
            >
              <Input id="whatsapp" type="tel" className="h-10" {...register("whatsapp")} />
            </SettingsField>

            <SettingsField
              label="Email"
              htmlFor="email"
              hint="For receipts and customer replies"
              error={errors.email?.message}
            >
              <Input id="email" type="email" className="h-10" {...register("email")} />
            </SettingsField>

            <SettingsField label="Website" htmlFor="website" hint="Your main site or social link">
              <div className="flex overflow-hidden rounded-lg border bg-background shadow-xs">
                <span className="inline-flex shrink-0 items-center border-r bg-muted/40 px-3 text-xs text-muted-foreground">
                  https://
                </span>
                <Input
                  id="website"
                  className="h-10 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                  placeholder="yourbusiness.com"
                  {...register("website")}
                />
              </div>
            </SettingsField>
          </div>
        </SettingsSection>

        <SettingsStickyFooter>
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty}
            onClick={() => reset(businessToProfile(business))}
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || isSubmitting || updateMutation.isPending}
          >
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
