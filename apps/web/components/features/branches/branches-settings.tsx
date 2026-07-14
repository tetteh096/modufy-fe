"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, ExternalLink, MapPin, Plus, Phone, ChevronRight, Users } from "lucide-react";
import { branchesApi, businessApi, getApiErrorMessage } from "@/lib/api";
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
import { TeamRoleBadge } from "@/components/features/team/team-role-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [detailsOpen, setDetailsOpen] = useState(false);
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

  const { data: teamData, isLoading: teamLoading } = useQuery({
    queryKey: ["team"],
    queryFn: businessApi.team.list,
    enabled: detailsOpen,
  });

  const storefrontDirty =
    storefrontEnabled !== branch.storefront_enabled ||
    storefrontSlug.trim() !== (branch.storefront_slug ?? "");

  const branchMembers = teamData?.members.filter((m) => 
    m.branch_ids?.includes(branch.id)
  ) ?? [];

  return (
    <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
      <DialogTrigger render={
        <button
          type="button"
          className="w-full text-left rounded-xl border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-primary/25 hover:shadow-xs transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-200">
              <Building2 className="h-5.5 w-5.5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground text-[0.95rem]">{branch.name}</p>
                {branch.is_default && (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/30 font-medium px-2">
                    Default
                  </Badge>
                )}
                {!branch.is_active && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-border font-medium px-2">
                    Inactive
                  </Badge>
                )}
                {branch.storefront_enabled && branch.storefront_slug && (
                  <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/30 font-medium px-2">
                    Storefront live
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {(branch.address || branch.city || branch.area) && (
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                    {[branch.address, branch.area, branch.city].filter(Boolean).join(", ")}
                  </span>
                )}
                {branch.phone && (
                  <span className="flex items-center gap-1.5 shrink-0">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                    {branch.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors font-medium">
              View details
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>
      } />
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Branch Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          {/* Info grid */}
          <div className="space-y-2.5">
            <p className="text-base font-semibold text-foreground">{branch.name}</p>
            <div className="grid gap-2 text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl border">
              {(branch.address || branch.city || branch.area) && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-muted-foreground/70 mt-0.5 shrink-0" />
                  <span>{[branch.address, branch.area, branch.city].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {branch.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                  <span>{branch.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Staff section */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Assigned Team Members ({branchMembers.length})
            </p>
            
            {teamLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading team list...</div>
            ) : branchMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted/15 p-4 rounded-xl border border-dashed border-border/60 text-center">
                No staff members explicitly assigned to this branch.
              </p>
            ) : (
              <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
                {branchMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/10">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.email || m.phone}</p>
                    </div>
                    <TeamRoleBadge role={m.roles[0]} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Storefront Section */}
          {multiBranch && (
            <div className="bg-muted/30 p-4 rounded-xl border border-border/40 space-y-3.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Branch storefront</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Give this location its own public shop URL with branch-specific stock and catalog.
                </p>
              </div>
              <label className="flex items-center gap-2.5 text-sm font-medium text-foreground cursor-pointer">
                <Checkbox
                  checked={storefrontEnabled}
                  onCheckedChange={(v) => setStorefrontEnabled(v === true)}
                />
                Enable storefront for this branch
              </label>
              {storefrontEnabled && (
                <div className="space-y-2">
                  <Label htmlFor={`storefront-slug-${branch.id}`} className="text-xs font-semibold text-muted-foreground">Public URL slug</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-1.5 text-sm text-muted-foreground bg-background rounded-lg border border-border px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="shrink-0 text-muted-foreground/60 select-none">/p/</span>
                      <input
                        id={`storefront-slug-${branch.id}`}
                        value={storefrontSlug}
                        onChange={(e) => setStorefrontSlug(e.target.value.toLowerCase())}
                        placeholder="east-legon"
                        className="w-full bg-transparent py-1.5 outline-none text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                    {branch.storefront_enabled && branch.storefront_slug && (
                      <a
                        href={`/p/${branch.storefront_slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[0.8rem] font-medium hover:bg-muted transition-colors shrink-0"
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
                  className="shadow-xs w-full sm:w-auto"
                >
                  {saveStorefront.isPending ? "Saving…" : "Save storefront"}
                </Button>
              )}
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-4 border-t flex items-center justify-between gap-3">
            {!branch.is_default ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDefault.mutate()}
                disabled={setDefault.isPending}
                className="shadow-xs"
              >
                {setDefault.isPending ? "Setting..." : "Set as default"}
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Primary default branch
              </span>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDetailsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddBranchDialog({
  canAdd,
  limits,
  trigger,
}: {
  canAdd: boolean;
  limits?: { used: number; max_branches: number; can_add: boolean };
  trigger?: React.ReactElement;
}) {
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

  const defaultTrigger = (
    <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
      <Plus className="h-4 w-4" />
      Add branch
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger render={trigger} /> : defaultTrigger}
      <DialogContent>
        {canAdd ? (
          <>
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
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive font-semibold">
                <Building2 className="h-5 w-5 text-destructive" />
                Branch Limit Reached
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4 text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                You are currently using <strong>{limits?.used ?? 1}</strong> of{" "}
                <strong>{limits?.max_branches ?? 1}</strong> branch{limits?.max_branches === 1 ? "" : "es"} included in your current plan.
              </p>
              <p className="text-sm text-muted-foreground">
                To expand your business with additional locations, localized inventory management, and branch-specific storefronts, please upgrade your plan.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button render={<a href="/settings/support" />} className="flex-1">
                  Upgrade plan
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
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
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <PageHeader
        title="Branches"
        description="Manage your shop locations. Staff can be assigned to one or more branches."
        action={<AddBranchDialog canAdd={limits?.can_add ?? false} limits={limits} />}
      />

      {limits && (
        <p className="text-sm text-muted-foreground -mt-6">
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
          <div className="space-y-6">
            <div className="grid gap-4">
              {branches.map((b) => (
                <BranchCard key={b.id} branch={b} multiBranch={multiBranch} />
              ))}
            </div>
            
            <AddBranchDialog
              canAdd={limits?.can_add ?? false}
              limits={limits}
              trigger={
                <button
                  type="button"
                  className="w-full flex flex-col items-center justify-center gap-4 p-10 border border-dashed rounded-xl border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/[0.01] active:bg-primary/[0.03] transition-all cursor-pointer group text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-sm flex items-center justify-center gap-1.5">
                      Add a new branch
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Expand your business to a new location with separate stock, storefront, and staff.
                    </p>
                  </div>
                </button>
              }
            />
          </div>
        )}
      </SettingsSection>
    </div>
  );
}
