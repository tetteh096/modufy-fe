"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown, LayoutTemplate, Monitor, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarketingEmailPreview } from "@/components/features/marketing/marketing-email-preview";
import { EMAIL_CONTENT_SNIPPETS } from "@/lib/marketing-email";
import { MERGE_TAGS, categoryLabel } from "@/components/features/marketing/marketing-shared";
import type { MarketingTemplate } from "@/types/api";
import { cn } from "@/lib/utils";

type EmailNewsletterComposerProps = {
  subject: string;
  onSubjectChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  templates?: MarketingTemplate[];
  selectedTemplateId?: string;
  onSelectTemplate?: (template: MarketingTemplate) => void;
  businessName?: string;
  layout?: "sheet" | "page";
};

export function EmailNewsletterComposer({
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  templates = [],
  selectedTemplateId,
  onSelectTemplate,
  businessName,
  layout = "sheet",
}: EmailNewsletterComposerProps) {
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const [htmlOpen, setHtmlOpen] = useState(false);
  const isPage = layout === "page";

  function insertAtCursor(snippet: string) {
    const el = bodyRef.current;
    if (!el) {
      onBodyChange(body + snippet);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = body.slice(0, start) + snippet + body.slice(end);
    onBodyChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + snippet.length;
    });
  }

  const emailTemplates = templates.filter((t) => t.channel === "email");

  const editorPanel = (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email-subject">Subject line</Label>
        <Input
          id="email-subject"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="A treat for you, {{first_name}}"
          className="text-base"
        />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Content blocks</p>
          <p className="text-xs text-muted-foreground">
            Click to insert — they appear where your cursor is in the editor.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {EMAIL_CONTENT_SNIPPETS.map((snippet) => (
            <Button
              key={snippet.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertAtCursor(snippet.html)}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {snippet.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Personalise</p>
        <div className="flex flex-wrap gap-2">
          {MERGE_TAGS.map((tag) => (
            <Button
              key={tag.token}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => insertAtCursor(tag.token)}
            >
              {tag.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="ghost"
          className="h-auto w-full justify-between px-0 hover:bg-transparent"
          onClick={() => setHtmlOpen((v) => !v)}
        >
          <span className="text-sm font-medium">HTML editor</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", htmlOpen && "rotate-180")} />
        </Button>
        {htmlOpen ? (
          <Textarea
            id="email-body"
            ref={bodyRef}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            rows={isPage ? 14 : 10}
            className="font-mono text-xs leading-relaxed"
            placeholder="<p>Hi {{first_name}},</p>"
          />
        ) : body ? (
          <p className="text-xs text-muted-foreground">
            Content added. Open HTML editor to fine-tune the markup.
          </p>
        ) : null}
      </div>
    </div>
  );

  const previewPanel = (
    <MarketingEmailPreview
      subject={subject}
      bodyHtml={body}
      businessName={businessName}
      className={isPage ? "shadow-lg" : undefined}
    />
  );

  return (
    <div className="space-y-6">
      {emailTemplates.length > 0 && onSelectTemplate ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Choose a template</CardTitle>
            </div>
            <CardDescription>
              Start from a newsletter design, then customise the copy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "grid gap-4",
                isPage ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-flow-col auto-cols-[168px] overflow-x-auto",
              )}
            >
              {emailTemplates.map((tpl) => {
                const selected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onSelectTemplate(tpl)}
                    className={cn(
                      "group relative rounded-xl border bg-card text-left transition-all hover:border-primary/40 hover:shadow-md",
                      selected && "border-primary ring-2 ring-primary/20 shadow-md",
                      !isPage && "w-[168px] shrink-0",
                    )}
                  >
                    {selected ? (
                      <span className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                    <MarketingEmailPreview
                      subject={tpl.subject}
                      bodyHtml={tpl.body}
                      businessName={businessName}
                      compact
                      chromeless
                    />
                    <div className="border-t px-3 py-2.5">
                      <p className="truncate text-sm font-semibold">{tpl.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {categoryLabel(tpl.category)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {isPage ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Design</CardTitle>
              </div>
              <CardDescription>Subject, blocks, and personalisation</CardDescription>
            </CardHeader>
            <CardContent>{editorPanel}</CardContent>
          </Card>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Inbox preview</p>
            </div>
            {previewPanel}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:hidden">
            <TabsTrigger value="design" className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Design
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1.5">
              <Monitor className="h-3.5 w-3.5" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="mt-4 space-y-4">
            {editorPanel}
          </TabsContent>

          <TabsContent value="preview" className="mt-4 lg:hidden">
            {previewPanel}
          </TabsContent>

          <div className="hidden lg:block mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Inbox preview</p>
            {previewPanel}
          </div>
        </Tabs>
      )}
    </div>
  );
}
