"use client";

import { useEffect, useRef } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { marketingApi, businessApi, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmailNewsletterComposer } from "./email-newsletter-composer";
import {
  MERGE_TAGS,
  TEMPLATE_CATEGORIES,
  categoryLabel,
  SMS_SEGMENT_LIMIT,
} from "./marketing-shared";
import type {
  MarketingChannel,
  MarketingTemplate,
  CreateMarketingTemplateRequest,
} from "@/types/api";
import { cn } from "@/lib/utils";

const templateSchema = z.object({
  channel: z.enum(["sms", "email"]),
  category: z.string().min(1, "Pick a category"),
  name: z.string().min(1, "Name is required").max(120),
  subject: z.string().max(255).optional(),
  body: z.string().min(1, "Message body is required"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export function TemplateDialog({
  open,
  onOpenChange,
  template,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: MarketingTemplate;
}) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(template);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema) as Resolver<TemplateFormValues>,
    defaultValues: {
      channel: template?.channel ?? "email",
      category: template?.category ?? "promotion",
      name: template?.name ?? "",
      subject: template?.subject ?? "",
      body: template?.body ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        channel: template?.channel ?? "email",
        category: template?.category ?? "promotion",
        name: template?.name ?? "",
        subject: template?.subject ?? "",
        body: template?.body ?? "",
      });
    }
  }, [open, template, form]);

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
    enabled: open,
    staleTime: 60_000,
  });

  const channel = form.watch("channel");
  const body = form.watch("body");
  const subject = form.watch("subject");

  const mutation = useMutation({
    mutationFn: (values: TemplateFormValues) => {
      if (isEdit && template) {
        return marketingApi.templates.update(template.id, {
          name: values.name,
          subject: values.subject,
          body: values.body,
        });
      }
      const payload: CreateMarketingTemplateRequest = {
        channel: values.channel,
        category: values.category,
        name: values.name,
        subject: values.channel === "email" ? values.subject : undefined,
        body: values.body,
      };
      return marketingApi.templates.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-templates"] });
      toast.success(isEdit ? "Template saved" : "Template created");
      onOpenChange(false);
      form.reset();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function insertTag(token: string) {
    const el = bodyRef.current;
    const current = form.getValues("body");
    if (!el) {
      form.setValue("body", current + token, { shouldValidate: true });
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + token + current.slice(end);
    form.setValue("body", next, { shouldValidate: true });
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + token.length;
    });
  }

  const segments = Math.max(1, Math.ceil((body?.length || 1) / SMS_SEGMENT_LIMIT));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "flex w-full flex-col overflow-y-auto",
          channel === "email" ? "sm:max-w-4xl" : "sm:max-w-lg",
        )}
      >
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit template" : "New template"}</SheetTitle>
          <SheetDescription>
            {channel === "email"
              ? "Build a reusable newsletter layout. Preview updates as you edit."
              : "Use merge tags like {{first_name}} — they are filled in per customer when you send."}
          </SheetDescription>
        </SheetHeader>

        <form
          className="mt-6 flex flex-1 flex-col gap-4"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          {!isEdit ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Channel</Label>
                <Select
                  value={channel}
                  onValueChange={(v) => form.setValue("channel", v as MarketingChannel)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email newsletter</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(v) => form.setValue("category", v as string)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {categoryLabel(c)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="tpl-name">Name</Label>
            <Input id="tpl-name" {...form.register("name")} placeholder="Spring newsletter" />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>

          {channel === "email" ? (
            <EmailNewsletterComposer
              subject={subject ?? ""}
              onSubjectChange={(v) => form.setValue("subject", v, { shouldValidate: true })}
              body={body ?? ""}
              onBodyChange={(v) => form.setValue("body", v, { shouldValidate: true })}
              businessName={business?.name}
            />
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="tpl-body">Message</Label>
                <span className="text-xs text-muted-foreground">
                  {body?.length || 0} chars · {segments} SMS
                </span>
              </div>
              <Textarea
                id="tpl-body"
                {...form.register("body")}
                ref={(el) => {
                  form.register("body").ref(el);
                  bodyRef.current = el;
                }}
                rows={5}
                placeholder="Hi {{first_name}}, ..."
              />
              {form.formState.errors.body ? (
                <p className="text-xs text-destructive">{form.formState.errors.body.message}</p>
              ) : null}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {MERGE_TAGS.map((tag) => (
                  <button
                    key={tag.token}
                    type="button"
                    onClick={() => insertTag(tag.token)}
                    className="rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {channel === "email" && form.formState.errors.body ? (
            <p className="text-xs text-destructive">{form.formState.errors.body.message}</p>
          ) : null}

          <div className="mt-auto flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? "Save changes" : "Create template"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
