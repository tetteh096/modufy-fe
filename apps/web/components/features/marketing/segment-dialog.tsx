"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { marketingApi, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "./marketing-shared";
import type {
  MarketingChannel,
  MarketingSegment,
  MarketingSegmentRules,
} from "@/types/api";

type Draft = {
  name: string;
  description: string;
  tags: string;
  source: string;
  has_email: boolean;
  has_phone: boolean;
  inactive_days: string;
  active_within_days: string;
  created_within_days: string;
  min_lifetime_spent: string;
};

function toRules(d: Draft): MarketingSegmentRules {
  const num = (s: string) => {
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const tags = d.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    tags_any: tags.length ? tags : undefined,
    source: d.source && d.source !== "any" ? d.source : undefined,
    has_email: d.has_email || undefined,
    has_phone: d.has_phone || undefined,
    inactive_days: num(d.inactive_days),
    active_within_days: num(d.active_within_days),
    created_within_days: num(d.created_within_days),
    min_lifetime_spent: num(d.min_lifetime_spent),
  };
}

function initialDraft(segment?: MarketingSegment): Draft {
  const r = segment?.rules ?? {};
  return {
    name: segment?.name ?? "",
    description: segment?.description ?? "",
    tags: (r.tags_any ?? []).join(", "),
    source: r.source ?? "any",
    has_email: r.has_email ?? false,
    has_phone: r.has_phone ?? false,
    inactive_days: r.inactive_days ? String(r.inactive_days) : "",
    active_within_days: r.active_within_days ? String(r.active_within_days) : "",
    created_within_days: r.created_within_days ? String(r.created_within_days) : "",
    min_lifetime_spent: r.min_lifetime_spent ? String(r.min_lifetime_spent) : "",
  };
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function SegmentDialog({
  open,
  onOpenChange,
  segment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment?: MarketingSegment;
}) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(segment);
  const [draft, setDraft] = useState<Draft>(() => initialDraft(segment));
  const [previewChannel, setPreviewChannel] = useState<MarketingChannel>("sms");

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const rules = useMemo(() => toRules(draft), [draft]);

  const { data: preview, isFetching } = useQuery({
    queryKey: ["marketing-segment-preview", previewChannel, JSON.stringify(rules)],
    queryFn: () => marketingApi.segments.preview(previewChannel, rules),
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const body = { name: draft.name.trim(), description: draft.description.trim(), rules };
      if (isEdit && segment) return marketingApi.segments.update(segment.id, body);
      return marketingApi.segments.create(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-segments"] });
      toast.success(isEdit ? "Segment saved" : "Segment created");
      onOpenChange(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function submit() {
    if (!draft.name.trim()) {
      toast.error("Give the segment a name");
      return;
    }
    mutation.mutate();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit segment" : "New segment"}</SheetTitle>
          <SheetDescription>
            Build an audience from your customer book. Rules are checked again each time you send,
            so the list stays current.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="seg-name">Name</Label>
            <Input
              id="seg-name"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Lapsed customers"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seg-desc">Description</Label>
            <Input
              id="seg-desc"
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Optional note"
            />
          </div>

          <div className="rounded-xl border p-4 space-y-4">
            <p className="text-sm font-medium">Rules</p>

            <div className="space-y-1.5">
              <Label className="text-xs">Tags (any of, comma separated)</Label>
              <Input
                value={draft.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="vip, wholesale"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Has a phone number</span>
              <Switch checked={draft.has_phone} onChange={(v) => set("has_phone", v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Has an email address</span>
              <Switch checked={draft.has_email} onChange={(v) => set("has_email", v)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Inactive for N+ days"
                value={draft.inactive_days}
                onChange={(v) => set("inactive_days", v)}
                placeholder="90"
              />
              <NumberField
                label="Active within N days"
                value={draft.active_within_days}
                onChange={(v) => set("active_within_days", v)}
                placeholder="30"
              />
              <NumberField
                label="Joined within N days"
                value={draft.created_within_days}
                onChange={(v) => set("created_within_days", v)}
                placeholder="14"
              />
              <NumberField
                label="Lifetime spend at least"
                value={draft.min_lifetime_spent}
                onChange={(v) => set("min_lifetime_spent", v)}
                placeholder="500"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" /> Reach preview
              </div>
              <Tabs
                value={previewChannel}
                onValueChange={(v) => setPreviewChannel(v as MarketingChannel)}
              >
                <TabsList className="h-8">
                  <TabsTrigger value="sms" className="text-xs">
                    SMS
                  </TabsTrigger>
                  <TabsTrigger value="email" className="text-xs">
                    Email
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-background p-2">
                <p className="text-lg font-semibold">{isFetching ? "…" : preview?.reachable ?? 0}</p>
                <p className="text-xs text-muted-foreground">Reachable</p>
              </div>
              <div className="rounded-lg bg-background p-2">
                <p className="text-lg font-semibold">{isFetching ? "…" : preview?.no_contact ?? 0}</p>
                <p className="text-xs text-muted-foreground">No contact</p>
              </div>
              <div className="rounded-lg bg-background p-2">
                <p className="text-lg font-semibold">{isFetching ? "…" : preview?.suppressed ?? 0}</p>
                <p className="text-xs text-muted-foreground">Opted out</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {preview?.total ?? 0} customers match. Only reachable ones receive a {previewChannel.toUpperCase()} send.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={submit} disabled={mutation.isPending}>
            {isEdit ? "Save segment" : "Create segment"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
