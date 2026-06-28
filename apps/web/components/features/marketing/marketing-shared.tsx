"use client";

import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare } from "lucide-react";
import type {
  MarketingChannel,
  MarketingCampaignStatus,
  MarketingSegmentRules,
} from "@/types/api";

// Merge tags the backend renders. Surfaced in the UI so users insert the right tokens.
export const MERGE_TAGS = [
  { token: "{{first_name}}", label: "First name" },
  { token: "{{customer_name}}", label: "Full name" },
  { token: "{{business_name}}", label: "Business name" },
] as const;

export const TEMPLATE_CATEGORIES = [
  "welcome",
  "promotion",
  "win_back",
  "birthday",
  "flash_sale",
  "review",
  "order_ready",
  "reminder",
  "seasonal",
  "restock",
] as const;

export function categoryLabel(category: string) {
  return category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ChannelBadge({ channel }: { channel: MarketingChannel }) {
  if (channel === "email") {
    return (
      <Badge variant="secondary" className="gap-1 font-normal">
        <Mail className="h-3 w-3" /> Email
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1 font-normal">
      <MessageSquare className="h-3 w-3" /> SMS
    </Badge>
  );
}

const STATUS_STYLES: Record<MarketingCampaignStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  scheduled: { label: "Scheduled", className: "bg-amber-500/15 text-amber-600" },
  sending: { label: "Sending", className: "bg-sky-500/15 text-sky-600" },
  sent: { label: "Sent", className: "bg-emerald-600/15 text-emerald-600" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
  failed: { label: "Failed", className: "bg-destructive/15 text-destructive" },
};

export function CampaignStatusBadge({ status }: { status: MarketingCampaignStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return <Badge className={s.className}>{s.label}</Badge>;
}

export function formatDateTime(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Converts a datetime-local input value to an RFC3339 string, or undefined when empty.
export function toISO(local?: string) {
  if (!local) return undefined;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

// Converts an RFC3339 string to a datetime-local input value.
export function fromISO(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Human summary of segment rules for cards and pickers.
export function summarizeRules(rules: MarketingSegmentRules): string {
  const parts: string[] = [];
  if (rules.tags_any?.length) parts.push(`tagged ${rules.tags_any.join(", ")}`);
  if (rules.source) parts.push(`from ${rules.source}`);
  if (rules.has_email) parts.push("has email");
  if (rules.has_phone) parts.push("has phone");
  if (rules.inactive_days) parts.push(`inactive ${rules.inactive_days}+ days`);
  if (rules.active_within_days) parts.push(`active in ${rules.active_within_days} days`);
  if (rules.created_within_days) parts.push(`joined in ${rules.created_within_days} days`);
  if (rules.min_lifetime_spent) parts.push(`spent ${rules.min_lifetime_spent}+`);
  return parts.length ? parts.join(" · ") : "All customers";
}

export const SMS_SEGMENT_LIMIT = 160;

export function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
