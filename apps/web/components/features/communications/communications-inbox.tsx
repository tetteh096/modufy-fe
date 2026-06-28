"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
  Loader2,
  Settings2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { communicationsApi, customersApi } from "@/lib/api";
import type { CommunicationItem } from "@/types/api";
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
      return <CheckCircle2 className="h-3 w-3 text-primary" />;
    case "failed":
      return <AlertCircle className="h-3 w-3 text-destructive" />;
    case "pending":
    case "queued":
      return <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />;
    default:
      return <Clock className="h-3 w-3 text-muted-foreground" />;
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
  if (item.channel === "email") {
    const local = item.recipient.split("@")[0]?.replace(/\W/g, "") ?? "";
    return (local.slice(0, 2) || "E").toUpperCase();
  }
  const digits = item.recipient.replace(/\D/g, "");
  return digits.slice(-2) || "SM";
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
        "flex min-h-[560px] overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <aside className="hidden w-[240px] shrink-0 flex-col border-r bg-muted/15 lg:flex">
        <div className="space-y-2 border-b p-4">
          <Button className="w-full gap-2 shadow-sm" onClick={() => openCompose("sms")}>
            <PenLine className="h-4 w-4" />
            New message
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs"
            onClick={() => openCompose("email")}
          >
            <Mail className="h-3.5 w-3.5" />
            New email
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-70" />
                <span className="flex-1 text-left">{f.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] tabular-nums",
                      active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
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
          <div className="mt-auto border-t p-4">
            <div className="rounded-xl border bg-gradient-to-br from-primary/8 via-card to-card p-3.5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">SMS credits</span>
                <Badge variant={sender.sms_credits < 5 ? "destructive" : "secondary"} className="tabular-nums">
                  {sender.sms_credits}
                </Badge>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Sending as <span className="font-medium text-foreground">{sender.business_name}</span>
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/settings" />}
                variant="ghost"
                size="sm"
                className="h-8 w-full gap-1.5 text-xs text-muted-foreground"
              >
                <Settings2 className="h-3.5 w-3.5" />
                SMS settings
                <ArrowUpRight className="ml-auto h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </aside>

      <div
        className={cn(
          "flex min-h-0 w-full shrink-0 flex-col border-r lg:w-[min(100%,420px)] xl:w-[440px]",
          composing && "hidden lg:flex",
        )}
      >
        <div className="flex items-center gap-2 border-b p-3 lg:hidden">
          <Button size="sm" className="shrink-0 gap-1.5" onClick={() => openCompose("sms")}>
            <PenLine className="h-3.5 w-3.5" />
            Compose
          </Button>
          <div className="flex flex-1 gap-1 rounded-lg bg-muted/50 p-0.5">
            {folders.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setChannel(f.key)}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-[11px] font-medium transition-colors",
                  channel === f.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search recipient or message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 border-border/60 bg-background/80 pl-9"
            />
          </div>
          {sender && (
            <p className="mt-2 px-1 text-[11px] text-muted-foreground lg:hidden">
              {sender.sms_credits} SMS credits · {sender.business_name}
            </p>
          )}
        </div>

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
        className="px-6 py-16"
        title="No messages yet"
        description="Send your first SMS or email. Order confirmations, reminders, and manual messages will appear here."
        action={
          <Button size="sm" onClick={onCompose} className="mt-2 gap-1.5">
            <PenLine className="h-3.5 w-3.5" />
            Compose message
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex-1 divide-y divide-border/50 overflow-y-auto">
      {items.map((item) => {
        const active = item.id === selectedId;
        const preview = listPreview(item, businessName);
        const displayRecipient = formatRecipientDisplay(item.recipient, item.channel);

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full items-start gap-3 px-3 py-3.5 text-left transition-colors",
                active
                  ? "bg-primary/[0.07] ring-1 ring-inset ring-primary/15"
                  : "hover:bg-muted/35",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  item.channel === "sms"
                    ? "bg-sky-500/12 text-sky-800 dark:text-sky-200"
                    : "bg-primary/10 text-primary",
                )}
              >
                {recipientInitials(item)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-semibold">{displayRecipient}</p>
                    <Badge
                      variant="outline"
                      className="h-5 shrink-0 px-1.5 text-[9px] font-medium uppercase tracking-wide"
                    >
                      {item.channel}
                    </Badge>
                  </div>
                  <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {formatListWhen(item.created_at)}
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-sm leading-snug text-foreground/90">{preview}</p>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                      item.status === "failed"
                        ? "bg-destructive/10 text-destructive"
                        : item.status === "sent" || item.status === "delivered"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    <StatusIcon status={item.status} />
                    {item.status}
                  </span>
                  {isAutomated(item) && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Sparkles className="h-3 w-3" />
                      {eventLabel(item.event_type)}
                    </span>
                  )}
                  {item.sandbox && (
                    <Badge variant="outline" className="h-5 px-1.5 text-[9px]">
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
  sender?: { business_name: string; sms_credits: number };
  onCompose: () => void;
}) {
  if (!item) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/80 ring-1 ring-border/60">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-semibold">Select a message</p>
          <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
            Pick a conversation from the list, or start a new one.
          </p>
        </div>
        <Button onClick={onCompose} className="gap-1.5">
          <PenLine className="h-4 w-4" />
          Compose
        </Button>
      </div>
    );
  }

  const body = messageBody(item, sender?.business_name);
  const sentWhen = item.sent_at ?? item.created_at;
  const displayRecipient = formatRecipientDisplay(item.recipient, item.channel);
  const ChannelIcon = item.channel === "sms" ? MessageSquare : Mail;
  const showEmailSubject =
    item.channel === "email" &&
    item.subject &&
    item.subject.trim().length > 0 &&
    item.subject !== "Direct message";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b bg-card/60 px-5 py-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                item.channel === "sms"
                  ? "bg-sky-500/12 text-sky-800 dark:text-sky-200"
                  : "bg-primary/10 text-primary",
              )}
            >
              {recipientInitials(item)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{displayRecipient}</h3>
                <Badge variant={statusVariant(item.status)} className="h-5 gap-1 capitalize">
                  <StatusIcon status={item.status} />
                  {item.status}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                To {item.recipient}
                {sender?.business_name ? ` · from ${sender.business_name}` : ""}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatDetailWhen(sentWhen)}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={onCompose}>
            <PenLine className="h-3.5 w-3.5" />
            Reply
          </Button>
        </div>

        {showEmailSubject && (
          <h2 className="mt-4 text-lg font-semibold leading-snug">{item.subject}</h2>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {item.channel === "sms" ? (
          <div className="flex flex-col items-end gap-2 max-w-lg ml-auto">
            <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground shadow-sm">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{body}</p>
            </div>
            <p className="text-[11px] text-muted-foreground tabular-nums">{formatDetailWhen(sentWhen)}</p>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4 grid gap-2 border-b pb-4 text-sm">
              <div className="grid grid-cols-[4.5rem_1fr] gap-2">
                <span className="text-muted-foreground">From</span>
                <span className="font-medium">{sender?.business_name ?? "Your business"}</span>
              </div>
              <div className="grid grid-cols-[4.5rem_1fr] gap-2">
                <span className="text-muted-foreground">To</span>
                <span>{item.recipient}</span>
              </div>
              {showEmailSubject && (
                <div className="grid grid-cols-[4.5rem_1fr] gap-2">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="font-medium">{item.subject}</span>
                </div>
              )}
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{body}</div>
          </div>
        )}

        {item.sandbox && (
          <p className="mx-auto mt-4 max-w-lg rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            Sandbox mode — this message was not delivered to the mobile network.
          </p>
        )}
        {item.error_message && (
          <p className="mx-auto mt-4 max-w-lg rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            {item.error_message}
          </p>
        )}
        {item.delivered_at && (
          <p className="mt-4 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            Delivered {formatDetailWhen(item.delivered_at)}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-card/40 px-5 py-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ChannelIcon className="h-3.5 w-3.5" />
          {eventLabel(item.event_type)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SendHorizontal className="h-3.5 w-3.5" />
          Outbound only — replies go to your business email
        </span>
      </div>
    </div>
  );
}
