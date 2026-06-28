"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, ExternalLink, MapPin, Plus } from "lucide-react";
import { branchesApi, getApiErrorMessage } from "@/lib/api";
import type { Branch } from "@/types/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/features/settings/settings-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const createSchema = z.object({
  name: z.string().min(2, "Name is required"),
  code: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;

function BranchCard({ branch, multiBranch }: { branch: Branch; multiBranch: boolean }) {
  const qc = useQueryClient();
  const [storefrontEnabled, setStorefrontEnabled] = useState(branch.storefront_enabled);
  const [storefrontSlug, setStorefrontSlug] = useState(branch.storefront_slug);
  const setDefault = useMutation({
    mutationFn: () => branchesApi.update(branch.id, { set_default: true }),
    onSuccess: () => {
      toast.success("Default branch updated");
      void qc.invalidateQueries({ queryKey: ["branches"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const saveStorefront = useMutation({
    mutationFn: () =>
      branchesApi.update(branch.id, {
        storefront_enabled: storefrontEnabled,
        storefront_slug: storefrontSlug.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Branch storefront updated");
      void qc.invalidateQueries({ queryKey: ["branches"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const storefrontDirty =
    storefrontEnabled !== branch.storefront_enabled ||
    storefrontSlug.trim() !== (branch.storefront_slug ?? "");

  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col sm:flex-row sm:items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Building2 className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{branch.name}</p>
          {branch.is_default && <Badge variant="secondary">Default</Badge>}
          {!branch.is_active && <Badge variant="outline">Inactive</Badge>}
          {branch.storefront_enabled && branch.storefront_slug && (
            <Badge variant="outline">Storefront live</Badge>
          )}
        </div>
        {(branch.city || branch.area) && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {[branch.area, branch.city].filter(Boolean).join(", ")}
          </p>
        )}
        {branch.phone && <p className="text-sm text-muted-foreground">{branch.phone}</p>}
        {multiBranch && (
          <div className="mt-3 pt-3 border-t space-y-3">
            <p className="text-sm font-medium">Branch storefront</p>
            <p className="text-xs text-muted-foreground">
              Give this location its own public shop URL with branch-specific stock and catalog.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={storefrontEnabled}
                onCheckedChange={(v) => setStorefrontEnabled(v === true)}
              />
              Enable storefront for this branch
            </label>
            {storefrontEnabled && (
              <div className="space-y-2">
                <Label htmlFor={`storefront-slug-${branch.id}`}>Public URL slug</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="shrink-0">/p/</span>
                    <Input
                      id={`storefront-slug-${branch.id}`}
                      value={storefrontSlug}
                      onChange={(e) => setStorefrontSlug(e.target.value.toLowerCase())}
                      placeholder="east-legon"
                    />
                  </div>
                  {branch.storefront_enabled && branch.storefront_slug && (
                    <a
                      href={`/p/${branch.storefront_slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-7 items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Preview
                    </a>
                  )}
                </div>
              </div>
            )}
            {storefrontDirty && (
              <Button
                size="sm"
                onClick={() => saveStorefront.mutate()}
                disabled={saveStorefront.isPending || (storefrontEnabled && !storefrontSlug.trim())}
              >
                {saveStorefront.isPending ? "Saving…" : "Save storefront"}
              </Button>
            )}
          </div>
        )}
      </div>
      {!branch.is_default && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDefault.mutate()}
          disabled={setDefault.isPending}
        >
          Set as default
        </Button>
      )}
    </div>
  );
}

function AddBranchDialog({ canAdd }: { canAdd: boolean }) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateForm>({ resolver: zodResolver(createSchema) });

  const createMutation = useMutation({
    mutationFn: branchesApi.create,
    onSuccess: () => {
      toast.success("Branch created");
      void qc.invalidateQueries({ queryKey: ["branches"] });
      reset();
      setOpen(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (!canAdd) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <Plus className="h-4 w-4" />
        Add branch
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New branch</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
        >
          <div className="space-y-2">
            <Label htmlFor="branch-name">Branch name</Label>
            <Input id="branch-name" placeholder="e.g. East Legon shop" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="branch-city">City</Label>
              <Input id="branch-city" {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-phone">Phone</Label>
              <Input id="branch-phone" {...register("phone")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-address">Address</Label>
            <Input id="branch-address" {...register("address")} />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting || createMutation.isPending}>
            {createMutation.isPending ? "Creating…" : "Create branch"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BranchesSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: branchesApi.list,
  });

  if (isLoading) return <SectionLoader />;

  const branches = data?.branches ?? [];
  const limits = data?.limits;
  const multiBranch = (limits?.max_branches ?? 1) > 1 || branches.length > 1;

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        title="Branches"
        description="Manage your shop locations. Staff can be assigned to one or more branches."
        action={<AddBranchDialog canAdd={limits?.can_add ?? false} />}
      />

      {limits && (
        <p className="text-sm text-muted-foreground -mt-4">
          Using {limits.used} of {limits.max_branches} branch{limits.max_branches === 1 ? "" : "es"} on
          your plan.
          {!limits.can_add && " Contact support to add more locations."}
        </p>
      )}

      <SettingsSection title="Your branches" icon={Building2}>
        {branches.length === 0 ? (
          <EmptyState
            title="No branches"
            description="A default branch is created automatically when you onboard."
          />
        ) : (
          <div className="space-y-3">
            {branches.map((b) => (
              <BranchCard key={b.id} branch={b} multiBranch={multiBranch} />
            ))}
          </div>
        )}
      </SettingsSection>
    </div>
  );
}
