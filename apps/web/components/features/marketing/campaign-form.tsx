"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarClock,
  Mail,
  MessageSquare,
  Save,
  Users,
} from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailNewsletterComposer } from "./email-newsletter-composer";
import {
  MERGE_TAGS,
  SMS_SEGMENT_LIMIT,
  fromISO,
  summarizeRules,
} from "./marketing-shared";
import type { MarketingCampaign, MarketingChannel, MarketingTemplate } from "@/types/api";
import { cn } from "@/lib/utils";

type CampaignFormProps = {
  campaign?: MarketingCampaign;
};

function ChannelCard({
  active,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Mail;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm",
        active && "border-primary ring-2 ring-primary/20 shadow-sm",
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-lg",
          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isEdit = Boolean(campaign);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const initialChannel =
    (searchParams.get("channel") as MarketingChannel | null) ?? campaign?.channel ?? "email";

  const [channel, setChannel] = useState<MarketingChannel>(initialChannel);
  const [name, setName] = useState(campaign?.name ?? "");
  const [segmentId, setSegmentId] = useState(campaign?.segment_id ?? "");
  const [templateId, setTemplateId] = useState(campaign?.template_id ?? "");
  const [subject, setSubject] = useState(campaign?.subject ?? "");
  const [body, setBody] = useState(campaign?.body ?? "");
  const [scheduledAt, setScheduledAt] = useState(fromISO(campaign?.scheduled_at));

  useEffect(() => {
    if (campaign) {
      setChannel(campaign.channel);
      setName(campaign.name);
      setSegmentId(campaign.segment_id ?? "");
      setTemplateId(campaign.template_id ?? "");
      setSubject(campaign.subject ?? "");
      setBody(campaign.body);
      setScheduledAt(fromISO(campaign.scheduled_at));
    }
  }, [campaign]);

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
    staleTime: 60_000,
  });

  const { data: segmentsData } = useQuery({
    queryKey: ["marketing-segments"],
    queryFn: marketingApi.segments.list,
  });
  const { data: templatesData } = useQuery({
    queryKey: ["marketing-templates"],
    queryFn: () => marketingApi.templates.list(),
  });

  const segments = segmentsData?.segments ?? [];
  const allTemplates = templatesData?.templates ?? [];
  const smsTemplates = allTemplates.filter((t) => t.channel === "sms");
  const selectedSegment = segments.find((s) => s.id === segmentId);

  function applyTemplate(tpl: MarketingTemplate) {
    setTemplateId(tpl.id);
    setBody(tpl.body);
    if (channel === "email") setSubject(tpl.subject);
  }

  function insertTag(token: string) {
    const el = bodyRef.current;
    if (!el) {
      setBody((b) => b + token);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    setBody(body.slice(0, start) + token + body.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + token.length;
    });
  }

  const mutation = useMutation({
    mutationFn: () => {
      const schedule = scheduledAt ? new Date(scheduledAt).toISOString() : undefined;
      if (isEdit && campaign) {
        return marketingApi.campaigns.update(campaign.id, {
          name: name.trim(),
          subject: channel === "email" ? subject : undefined,
          body,
          segment_id: segmentId,
          scheduled_at: schedule,
        });
      }
      return marketingApi.campaigns.create({
        name: name.trim(),
        channel,
        segment_id: segmentId,
        template_id: templateId || undefined,
        subject: channel === "email" ? subject : undefined,
        body,
        scheduled_at: schedule,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      toast.success(isEdit ? "Campaign saved" : "Campaign saved as draft");
      router.push("/marketing");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function submit() {
    if (!name.trim()) return toast.error("Name your campaign");
    if (!segmentId) return toast.error("Choose an audience segment");
    if (!body.trim()) return toast.error("Write a message");
    if (channel === "email" && !subject.trim()) return toast.error("Add an email subject");
    mutation.mutate();
  }

  const segCount = Math.max(1, Math.ceil((body.length || 1) / SMS_SEGMENT_LIMIT));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          nativeButton={false}
          render={<Link href="/marketing" />}
          variant="ghost"
          size="sm"
          className="w-fit gap-1.5 -ml-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Campaigns
        </Button>
        <Button onClick={submit} disabled={mutation.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {isEdit ? "Save changes" : "Save draft"}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-4 xl:sticky xl:top-6 xl:self-start">
          {!isEdit ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Channel</CardTitle>
                <CardDescription>How you want to reach customers</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <ChannelCard
                  active={channel === "email"}
                  onClick={() => {
                    setChannel("email");
                    setTemplateId("");
                    setBody("");
                    setSubject("");
                  }}
                  icon={Mail}
                  title="Email newsletter"
                  description="Designed emails with live inbox preview"
                />
                <ChannelCard
                  active={channel === "sms"}
                  onClick={() => {
                    setChannel("sms");
                    setTemplateId("");
                    setBody("");
                    setSubject("");
                  }}
                  icon={MessageSquare}
                  title="SMS blast"
                  description="Short text messages to phones"
                />
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Campaign details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="camp-name">Name</Label>
                <Input
                  id="camp-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="June newsletter"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Audience</CardTitle>
              </div>
              <CardDescription>Who receives this campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {segments.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">No segments yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create a saved audience under Segments first.
                  </p>
                  <Button
                    nativeButton={false}
                    render={<Link href="/marketing/segments" />}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Create segment
                  </Button>
                </div>
              ) : (
                <>
                  <Select value={segmentId} onValueChange={(v) => setSegmentId(v as string)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({s.member_count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSegment ? (
                    <p className="text-xs text-muted-foreground">
                      {summarizeRules(selectedSegment.rules)}
                    </p>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Schedule</CardTitle>
              </div>
              <CardDescription>Optional — leave blank to send manually</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="camp-schedule"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </CardContent>
          </Card>
        </aside>

        <main className="min-w-0 xl:col-span-8">
          {channel === "email" ? (
            <EmailNewsletterComposer
              layout="page"
              subject={subject}
              onSubjectChange={setSubject}
              body={body}
              onBodyChange={setBody}
              templates={!isEdit ? allTemplates : undefined}
              selectedTemplateId={templateId || undefined}
              onSelectTemplate={!isEdit ? applyTemplate : undefined}
              businessName={business?.name}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SMS message</CardTitle>
                <CardDescription>
                  Keep it short — merge tags personalise each text.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEdit && smsTemplates.length > 0 ? (
                  <div className="space-y-2">
                    <Label>Start from a template</Label>
                    <Select
                      value={templateId}
                      onValueChange={(v) => {
                        const tpl = smsTemplates.find((t) => t.id === v);
                        if (tpl) applyTemplate(tpl);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Blank message" />
                      </SelectTrigger>
                      <SelectContent>
                        {smsTemplates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="camp-body">Message</Label>
                    <span className="text-xs text-muted-foreground">
                      {body.length} chars · {segCount} SMS
                    </span>
                  </div>
                  <Textarea
                    id="camp-body"
                    ref={bodyRef}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    className="resize-none text-sm leading-relaxed"
                    placeholder="Hi {{first_name}}, ..."
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {MERGE_TAGS.map((tag) => (
                      <Button
                        key={tag.token}
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => insertTag(tag.token)}
                      >
                        {tag.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
