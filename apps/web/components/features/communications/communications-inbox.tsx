"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Mail,
  MessageSquare,
  Inbox,
  PenLine,
  Search,
  SendHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Settings2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { communicationsApi, customersApi, getApiErrorMessage } from "@/lib/api";
import type { CommunicationItem, CommunicationsSenderInfo } from "@/types/api";
import { CommunicationsCompose } from "@/components/features/communications/communications-compose";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";

type ChannelFilter = "all" | "email" | "sms";

const folders: { key: ChannelFilter; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: Inbox },
  { key: "email", label: "Email", icon: Mail },
  { key: "sms", label: "SMS", icon: MessageSquare },
];

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "delivered":
    case "sent":
      return "default";
    case "failed":
      return "destructive";
    case "pending":
    case "queued":
      return "outline";
    default:
      return "secondary";
  }
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "delivered":
    case "sent":
      return <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />;
    case "failed":
      return <AlertCircle className="h-3 w-3 text-destructive shrink-0" />;
    case "pending":
    case "queued":
      return <Loader2 className="h-3 w-3 text-muted-foreground animate-spin shrink-0" />;
    default:
      return <Clock className="h-3 w-3 text-muted-foreground shrink-0" />;
  }
}

function formatListWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatDetailWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function eventLabel(eventType: string) {
  const labels: Record<string, string> = {
    manual_message: "Direct message",
    manual_sms: "Direct message",
    manual_email: "Direct email",
    appointment_reminder: "Appointment reminder",
    invoice_sent: "Invoice",
    order_confirmation: "Order confirmation",
  };
  if (labels[eventType]) return labels[eventType];
  return eventType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRecipientDisplay(recipient: string, channel: CommunicationItem["channel"]) {
  if (channel === "email") {
    const [local, domain] = recipient.split("@");
    if (!domain) return recipient;
    if (local.length <= 2) return recipient;
    return `${local.slice(0, 2)}···@${domain}`;
  }
  const digits = recipient.replace(/\D/g, "");
  if (digits.length >= 4) return `···${digits.slice(-4)}`;
  return recipient;
}

function recipientInitials(item: CommunicationItem) {
  if (item.recipient_name) {
    const parts = item.recipient_name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (item.recipient_name.slice(0, 2) || "C").toUpperCase();
  }
  if (item.channel === "email") {
    const local = item.recipient.split("@")[0]?.replace(/\W/g, "") ?? "";
    return (local.slice(0, 2) || "E").toUpperCase();
  }
  const digits = item.recipient.replace(/\D/g, "");
  return digits.slice(-2) || "SM";
}

function smsSegments(text: string) {
  const len = text.length;
  if (len <= 160) return 1;
  return Math.ceil(len / 153);
}

function messageBody(item: CommunicationItem, businessName?: string) {
  const raw = (item.body || item.preview || "").trim();
  if (!businessName || item.channel !== "sms") return raw;
  const prefix = `${businessName}: `;
  if (raw.startsWith(prefix)) return raw.slice(prefix.length);
  return raw;
}

function listPreview(item: CommunicationItem, businessName?: string) {
  const body = messageBody(item, businessName);
  if (body) return body;
  return item.subject && item.subject !== "Direct message" ? item.subject : eventLabel(item.event_type);
}

function isAutomated(item: CommunicationItem) {
  return !item.event_type.startsWith("manual");
}

type CommunicationsInboxProps = {
  customerId?: string;
  className?: string;
};

export function CommunicationsInbox({ customerId, className }: CommunicationsInboxProps) {
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [composeChannel, setComposeChannel] = useState<"sms" | "email">("sms");

  const { data: sender } = useQuery({
    queryKey: ["communications-sender"],
    queryFn: () => communicationsApi.sender(),
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["communications", customerId ?? "business", channel],
    queryFn: () =>
      customerId
        ? customersApi.communications(customerId, {
            channel: channel === "all" ? undefined : channel,
            limit: 100,
          })
        : communicationsApi.list({
            channel: channel === "all" ? undefined : channel,
            limit: 100,
          }),
  });

  const allItems = data?.items ?? [];
  const businessName = sender?.business_name;

  const folderCounts = useMemo(
    () => ({
      all: allItems.length,
      email: allItems.filter((i) => i.channel === "email").length,
      sms: allItems.filter((i) => i.channel === "sms").length,
    }),
    [allItems],
  );

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(
      (m) =>
        m.subject.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q) ||
        (m.body ?? "").toLowerCase().includes(q) ||
        m.recipient.toLowerCase().includes(q) ||
        m.event_type.toLowerCase().includes(q),
    );
  }, [allItems, search]);

  const selected = items.find((m) => m.id === selectedId) ?? items[0] ?? null;

  function openCompose(ch: "sms" | "email") {
    setComposeChannel(ch);
    setComposing(true);
  }

  if (isLoading) {
    return <SectionLoader className="py-16" />;
  }

  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden rounded-xl border bg-card shadow-xs",
        className,
      )}
    >
      {/* Folder sidebar (large layouts) */}
      <aside className="hidden w-[240px] shrink-0 flex-col border-r bg-muted/20 lg:flex">
        <div className="space-y-2 border-b p-4">
          <Button className="w-full gap-2 shadow-2xs font-semibold text-xs h-9" onClick={() => openCompose("sms")}>
            <PenLine className="h-4 w-4" />
            New SMS Message
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs font-semibold h-8"
            onClick={() => openCompose("email")}
          >
            <Mail className="h-3.5 w-3.5" />
            New Email
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <p className="px-2.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Outbox
          </p>
          {folders.map((f) => {
            const Icon = f.icon;
            const active = channel === f.key;
            const count = folderCounts[f.key];
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setChannel(f.key)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-muted text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-70" />
                <span className="flex-1 text-left">{f.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold tabular-nums",
                      active ? "bg-primary/20 text-primary" : "bg-muted border text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {sender && (
          <div className="mt-auto border-t p-4 bg-muted/10">
            <div className="rounded-xl border bg-card p-3.5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground">SMS Credits</span>
                <Badge variant={sender.sms_credits < 10 ? "destructive" : "secondary"} className="tabular-nums font-bold">
                  {sender.sms_credits}
                </Badge>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Sending as <span className="font-semibold text-foreground">{sender.business_name}</span>
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/settings/alerts" />}
                variant="ghost"
                size="sm"
                className="h-8 w-full gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <Settings2 className="h-3.5 w-3.5" />
                SMS Settings
                <ArrowUpRight className="ml-auto h-3 w-3 opacity-60" />
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Left List Pane */}
      <div
        className={cn(
          "flex min-h-0 w-full shrink-0 flex-col border-r lg:w-[380px] xl:w-[400px]",
          composing && "hidden lg:flex",
        )}
      >
        {/* Folder buttons (small layouts) */}
        <div className="flex items-center gap-2 border-b p-3 lg:hidden bg-muted/10">
          <Button size="sm" className="shrink-0 gap-1.5 h-8 text-xs font-semibold" onClick={() => openCompose("sms")}>
            <PenLine className="h-3.5 w-3.5" />
            Compose
          </Button>
          <div className="flex flex-1 gap-1 rounded-lg bg-muted/60 p-0.5">
            {folders.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setChannel(f.key)}
                className={cn(
                  "flex-1 rounded-md py-1 text-[11px] font-semibold transition-all",
                  channel === f.key
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="border-b px-4 py-3 bg-muted/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search outbox…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 border-border/60 bg-background pl-9 text-xs"
            />
          </div>
          {sender && (
            <p className="mt-2 px-1 text-[11px] text-muted-foreground lg:hidden">
              {sender.sms_credits} SMS credits · {sender.business_name}
            </p>
          )}
        </div>

        {/* Scrollable messages list */}
        <MessageList
          items={items}
          selectedId={selected?.id ?? null}
          businessName={businessName}
          onSelect={(id) => {
            setSelectedId(id);
            setComposing(false);
          }}
          onCompose={() => openCompose("sms")}
        />
      </div>

      {/* Right Detail Pane */}
      <div className="flex min-h-[400px] min-w-0 flex-1 flex-col bg-muted/10">
        {composing ? (
          <CommunicationsCompose
            open={composing}
            onOpenChange={(v) => {
              setComposing(v);
              if (!v) void refetch();
            }}
            defaultChannel={composeChannel}
            customerId={customerId}
            sender={sender}
            className="flex-1"
          />
        ) : (
          <MessageDetail
            item={selected}
            sender={sender}
            onCompose={() => openCompose(selected?.channel === "email" ? "email" : "sms")}
          />
        )}
      </div>
    </div>
  );
}

function MessageList({
  items,
  selectedId,
  businessName,
  onSelect,
  onCompose,
}: {
  items: CommunicationItem[];
  selectedId: string | null;
  businessName?: string;
  onSelect: (id: string) => void;
  onCompose: () => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        className="px-6 py-16 flex-1 flex items-center justify-center"
        title="No messages yet"
        description="Send your first SMS or email. Order confirmations, reminders, and manual messages will appear here."
        action={
          <Button size="sm" onClick={onCompose} className="mt-2 gap-1.5 h-8 font-semibold text-xs">
            <PenLine className="h-3.5 w-3.5" />
            Compose Message
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex-1 divide-y divide-border/40 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/15 hover:scrollbar-thumb-muted-foreground/30">
      {items.map((item) => {
        const active = item.id === selectedId;
        const preview = listPreview(item, businessName);
        const displayRecipient = item.recipient_name || formatRecipientDisplay(item.recipient, item.channel);

        return (
          <li key={item.id} className="list-none">
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-all duration-150 border-l-2",
                active
                  ? "bg-primary/[0.04] border-primary"
                  : "border-transparent hover:bg-muted/40",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold shadow-2xs",
                  item.channel === "sms"
                    ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                    : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                )}
              >
                {recipientInitials(item)}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <p className="truncate text-xs font-bold text-foreground leading-none">{displayRecipient}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-4 shrink-0 px-1 text-[8px] font-bold uppercase tracking-wider leading-none",
                        item.channel === "email" ? "border-emerald-500/20 text-emerald-700 dark:text-emerald-300 bg-emerald-500/5" : "border-sky-500/20 text-sky-700 dark:text-sky-300 bg-sky-500/5"
                      )}
                    >
                      {item.channel}
                    </Badge>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                    {formatListWhen(item.created_at)}
                  </span>
                </div>

                <p className="line-clamp-2 text-xs leading-normal text-muted-foreground">{preview}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize",
                      item.status === "failed"
                        ? "border-destructive/20 bg-destructive/10 text-destructive"
                        : item.status === "sent" || item.status === "delivered"
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border/60 bg-muted/40 text-muted-foreground",
                    )}
                  >
                    <StatusIcon status={item.status} />
                    {item.status}
                  </Badge>
                  {isAutomated(item) && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-medium text-muted-foreground">
                      <Sparkles className="h-2.5 w-2.5 opacity-60 text-primary" />
                      {eventLabel(item.event_type)}
                    </span>
                  )}
                  {item.sandbox && (
                    <Badge variant="outline" className="h-4 px-1 text-[8px] font-semibold border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300">
                      sandbox
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MessageDetail({
  item,
  sender,
  onCompose,
}: {
  item: CommunicationItem | null;
  sender?: CommunicationsSenderInfo;
  onCompose: () => void;
}) {
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  useEffect(() => {
    setReplyText("");
    setEmailSubject("");
  }, [item?.id]);

  const brandedSMS = useMemo(() => {
    if (!sender?.business_name || !replyText.trim()) return replyText;
    const prefix = `${sender.business_name}: `;
    if (replyText.startsWith(prefix)) return replyText;
    return `${prefix}${replyText.trim()}`;
  }, [replyText, sender?.business_name]);

  const segments = useMemo(() => smsSegments(brandedSMS), [brandedSMS]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!item) return;
      const payload = {
        to: item.recipient,
      };
      if (item.channel === "sms") {
        return communicationsApi.sendSMS({ ...payload, message: replyText.trim() });
      }
      return communicationsApi.sendEmail({
        ...payload,
        subject: emailSubject.trim() || `Re: ${item.subject || "Direct message"}`,
        body: replyText.trim(),
      });
    },
    onSuccess: () => {
      toast.success(item?.channel === "sms" ? "SMS reply sent" : "Email reply sent");
      setReplyText("");
      setEmailSubject("");
      queryClient.invalidateQueries({ queryKey: ["communications"] });
      queryClient.invalidateQueries({ queryKey: ["sms-wallet"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (!item) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border shadow-xs">
          <Inbox className="h-8 w-8 text-muted-foreground opacity-60" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Select a message</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground leading-normal">
            Choose an item from the outbox to see its delivery status and body content.
          </p>
        </div>
        <Button onClick={onCompose} className="gap-1.5 h-8 font-semibold text-xs shadow-2xs mt-1">
          <PenLine className="h-4 w-4" />
          Compose Message
        </Button>
      </div>
    );
  }

  const body = messageBody(item, sender?.business_name);
  const sentWhen = item.sent_at ?? item.created_at;
  const displayRecipient = item.recipient_name || formatRecipientDisplay(item.recipient, item.channel);
  const showEmailSubject =
    item.channel === "email" &&
    item.subject &&
    item.subject.trim().length > 0 &&
    item.subject !== "Direct message";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top Header Card */}
      <div className="border-b bg-card px-6 py-4.5 shadow-2xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black shadow-2xs",
                item.channel === "sms"
                  ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
              )}
            >
              {recipientInitials(item)}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-foreground leading-tight">{displayRecipient}</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 gap-1 capitalize font-semibold text-[10px]",
                    item.status === "failed" && "border-destructive/20 bg-destructive/5 text-destructive",
                    (item.status === "sent" || item.status === "delivered") && "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
                    (item.status === "pending" || item.status === "queued") && "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300"
                  )}
                >
                  <StatusIcon status={item.status} />
                  {item.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                To {item.recipient}
                {sender?.business_name ? ` · from ${sender.business_name}` : ""}
              </p>
              <p className="text-[10px] text-muted-foreground/80 font-medium">{formatDetailWhen(sentWhen)}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 gap-1.5 h-8 text-xs font-semibold shadow-2xs" onClick={onCompose}>
            <PenLine className="h-3.5 w-3.5" />
            Reply
          </Button>
        </div>

        {showEmailSubject && (
          <h2 className="mt-4 text-base font-bold leading-snug text-foreground border-t pt-3 border-dashed">
            {item.subject}
          </h2>
        )}
      </div>

      {/* Message Canvas Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/15 hover:scrollbar-thumb-muted-foreground/30 px-6 py-6 space-y-6">
        {item.channel === "sms" ? (
          /* Realistic Smartphone Chat Bubble Frame */
          <div className="max-w-md ml-auto space-y-1 flex flex-col items-end">
            <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-primary to-primary/95 text-primary-foreground px-4 py-3 shadow-sm border border-primary/20">
              <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">{body}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold px-1">
              <span>{formatDetailWhen(sentWhen)}</span>
              {item.status === "delivered" && (
                <span className="text-primary flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Delivered
                </span>
              )}
            </div>
          </div>
        ) : (
          /* High-Fidelity Email Client Card Frame */
          <div className="mx-auto max-w-2xl rounded-xl border bg-card shadow-sm overflow-hidden">
            {/* Sender Header Plate */}
            <div className="bg-muted/30 border-b px-5 py-4 text-xs space-y-2">
              <div className="grid grid-cols-[3.5rem_1fr] gap-2">
                <span className="text-muted-foreground font-semibold">From</span>
                <span className="font-bold text-foreground">
                  {sender?.business_name ?? "Your Business"} <span className="font-normal text-muted-foreground">&lt;outbound@modufy.app&gt;</span>
                </span>
              </div>
              <div className="grid grid-cols-[3.5rem_1fr] gap-2">
                <span className="text-muted-foreground font-semibold">To</span>
                <span className="font-medium text-foreground">{item.recipient}</span>
              </div>
              {showEmailSubject && (
                <div className="grid grid-cols-[3.5rem_1fr] gap-2">
                  <span className="text-muted-foreground font-semibold">Subject</span>
                  <span className="font-bold text-foreground">{item.subject}</span>
                </div>
              )}
            </div>
            {/* Email Body */}
            <div className="p-6 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans bg-card">
              {body}
            </div>
          </div>
        )}

        {/* Warning alerts inside the canvas */}
        {item.sandbox && (
          <div className="mx-auto max-w-lg flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Sandbox mode:</strong> This message was processed in a sandbox context and was not delivered to the mobile/email network.
            </p>
          </div>
        )}
        {item.error_message && (
          <div className="mx-auto max-w-lg flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
            <p className="leading-relaxed font-semibold">
              {item.error_message}
            </p>
          </div>
        )}
      </div>

      {/* Quick Reply Form */}
      <div className="border-t bg-card px-6 py-4.5 space-y-3">
        <div className="rounded-xl border bg-muted/20 p-3 space-y-3 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-card focus-within:border-primary/30 transition-all">
          {item.channel === "email" && (
            <div className="flex items-center gap-2 border-b pb-2 border-border/40">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-14 shrink-0">Subject</span>
              <Input
                placeholder={`Re: ${item.subject || "Direct message"}`}
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="h-7 border-none bg-transparent px-0 text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
              />
            </div>
          )}

          <div className="relative">
            <textarea
              placeholder={item.channel === "sms" ? "Type an SMS reply..." : "Type an email reply..."}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="w-full resize-none border-none bg-transparent p-0 text-xs font-medium focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60 scrollbar-thin"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (replyText.trim() && !sendMutation.isPending) {
                    sendMutation.mutate();
                  }
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-2 border-border/40">
            <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-2">
              {item.channel === "sms" ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {segments} segment{segments > 1 ? "s" : ""} · {replyText.trim() ? segments : 0} credit{segments > 1 ? "s" : ""}
                  </span>
                </>
              ) : (
                <>
                  <Mail className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Outgoing email</span>
                </>
              )}
            </div>

            <Button
              size="sm"
              disabled={!replyText.trim() || sendMutation.isPending}
              onClick={() => sendMutation.mutate()}
              className="h-7.5 px-3 text-xs font-bold gap-1.5 shadow-2xs shrink-0"
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <SendHorizontal className="h-3 w-3" />
              )}
              <span>Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-card px-6 py-3.5 text-[11px] text-muted-foreground font-medium shadow-2xs">
        <span className="inline-flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 opacity-70" />
          {eventLabel(item.event_type)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground/80">
          <SendHorizontal className="h-3.5 w-3.5 opacity-70 text-primary" />
          Outbound message — replies go to your business email
        </span>
      </div>
    </div>
  );
}
