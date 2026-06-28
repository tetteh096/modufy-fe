"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, FileText, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { marketingApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelBadge, categoryLabel } from "./marketing-shared";
import { TemplateDialog } from "./template-dialog";
import { MarketingEmailPreview } from "./marketing-email-preview";
import type { MarketingChannel, MarketingTemplate } from "@/types/api";

function TemplateCard({ template }: { template: MarketingTemplate }) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["marketing-templates"] });

  const duplicateMutation = useMutation({
    mutationFn: () => marketingApi.templates.duplicate(template.id),
    onSuccess: () => {
      invalidate();
      toast.success("Template duplicated");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => marketingApi.templates.remove(template.id),
    onSuccess: () => {
      invalidate();
      toast.success("Template deleted");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="truncate text-base">{template.name}</CardTitle>
            {template.is_system ? (
              <Badge variant="outline" className="gap-1 font-normal">
                <Lock className="h-3 w-3" /> Starter
              </Badge>
            ) : null}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <ChannelBadge channel={template.channel} />
            <Badge variant="secondary" className="font-normal">
              {categoryLabel(template.category)}
            </Badge>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => duplicateMutation.mutate()}
            disabled={duplicateMutation.isPending}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {!template.is_system ? (
            <>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setEditOpen(true)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
        {template.channel === "email" ? (
          <MarketingEmailPreview
            subject={template.subject}
            bodyHtml={template.body}
            compact
          />
        ) : (
          <p className="line-clamp-4 whitespace-pre-wrap break-words">{template.body}</p>
        )}
        {template.is_system ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => duplicateMutation.mutate()}
            disabled={duplicateMutation.isPending}
          >
            <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate to edit
          </Button>
        ) : null}
      </CardContent>
      {!template.is_system ? (
        <TemplateDialog open={editOpen} onOpenChange={setEditOpen} template={template} />
      ) : null}
    </Card>
  );
}

export function MarketingTemplatesManager() {
  const [channel, setChannel] = useState<"all" | MarketingChannel>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["marketing-templates"],
    queryFn: () => marketingApi.templates.list(),
  });

  const all = data?.templates ?? [];
  const list = channel === "all" ? all : all.filter((t) => t.channel === channel);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Reusable SMS and email newsletters. Starters look great out of the box — duplicate one to customise."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New template
          </Button>
        }
      />

      <Tabs value={channel} onValueChange={(v) => setChannel(v as "all" | MarketingChannel)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No templates"
          description="Create a template or switch the filter to see the built-in starters."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New template
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}

      <TemplateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
