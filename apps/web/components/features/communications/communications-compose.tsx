"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, X } from "lucide-react";
import { communicationsApi, customersApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api";
import type { CommunicationsSenderInfo } from "@/types/api";
import { CustomerSearchSelect } from "@/components/features/customers/customer-search-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ComposeChannel = "sms" | "email";

type CommunicationsComposeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultChannel?: ComposeChannel;
  customerId?: string;
  sender?: CommunicationsSenderInfo;
  className?: string;
};

function smsSegments(text: string) {
  const len = text.length;
  if (len <= 160) return 1;
  return Math.ceil(len / 153);
}

export function CommunicationsCompose({
  open,
  onOpenChange,
  defaultChannel = "sms",
  customerId: initialCustomerId,
  sender,
  className,
}: CommunicationsComposeProps) {
  const qc = useQueryClient();
  const [channel, setChannel] = useState<ComposeChannel>(defaultChannel);
  const [customerId, setCustomerId] = useState(initialCustomerId ?? "");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setChannel(defaultChannel);
      setCustomerId(initialCustomerId ?? "");
      setTo("");
      setSubject("");
      setMessage("");
    }
  }, [open, defaultChannel, initialCustomerId]);

  const { data: customer } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => customersApi.get(customerId),
    enabled: !!customerId,
  });

  useEffect(() => {
    if (!customer || to) return;
    if (channel === "email" && customer.email) setTo(customer.email);
    if (channel === "sms" && customer.phone) setTo(customer.phone);
  }, [customer, channel, to]);

  const brandedSMS = useMemo(() => {
    if (!sender?.business_name || !message.trim()) return message;
    const prefix = `${sender.business_name}: `;
    if (message.startsWith(prefix)) return message;
    return `${prefix}${message.trim()}`;
  }, [message, sender?.business_name]);

  const segments = useMemo(() => smsSegments(brandedSMS), [brandedSMS]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        customer_id: customerId || undefined,
        to: to.trim() || undefined,
      };
      if (channel === "sms") {
        return communicationsApi.sendSMS({ ...payload, message: message.trim() });
      }
      return communicationsApi.sendEmail({
        ...payload,
        subject: subject.trim(),
        body: message.trim(),
      });
    },
    onSuccess: () => {
      toast.success(channel === "sms" ? "SMS sent" : "Email sent");
      qc.invalidateQueries({ queryKey: ["communications"] });
      qc.invalidateQueries({ queryKey: ["sms-wallet"] });
      onOpenChange(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (!open) return null;

  const emailDisabled = sender && !sender.email_enabled;
  const smsDisabled = sender && sender.sms_credits < 1;

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="flex items-center justify-between gap-2 border-b px-6 py-4">
        <div>
          <h2 className="font-semibold text-base">Compose message</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {channel === "sms" ? "Send an SMS to a customer" : "Send an email to a customer"}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {sender && (
        <div className="mx-6 mt-4 rounded-lg border bg-muted/25 px-3 py-2.5 text-xs text-muted-foreground space-y-1">
          <p>
            <span className="font-medium text-foreground">Email</span> arrives as{" "}
            <span className="font-mono text-[11px]">{sender.email_from_label}</span>
            {sender.business_email ? (
              <>
                {" "}
                — replies go to <span className="text-foreground">{sender.business_email}</span>
              </>
            ) : (
              <span className="text-amber-600 dark:text-amber-500">
                {" "}
                — add your business email in Settings so customers can reply to you
              </span>
            )}
          </p>
          <p>
            <span className="font-medium text-foreground">SMS</span> shows sender{" "}
            <span className="font-mono">{sender.sms_sender_label}</span> with your name in the
            message: <span className="italic">{sender.business_name}: …</span>
          </p>
        </div>
      )}

      <div className="flex gap-1 px-6 pt-4 pb-0">
        {(["sms", "email"] as const).map((ch) => {
          const Icon = ch === "sms" ? MessageSquare : Mail;
          const disabled = ch === "email" ? emailDisabled : false;
          return (
            <button
              key={ch}
              type="button"
              disabled={disabled}
              onClick={() => setChannel(ch)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                channel === ch
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <Icon className="h-4 w-4" />
              {ch === "sms" ? "SMS" : "Email"}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div className="space-y-2">
          <Label>Customer</Label>
          <CustomerSearchSelect
            value={customerId}
            onValueChange={setCustomerId}
            placeholder="Search or pick a customer…"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compose-to">{channel === "sms" ? "Phone" : "Email"}</Label>
          <Input
            id="compose-to"
            placeholder={channel === "sms" ? "e.g. 0544919953" : "customer@example.com"}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        {channel === "email" && (
          <div className="space-y-2">
            <Label htmlFor="compose-subject">Subject</Label>
            <Input
              id="compose-subject"
              placeholder="Subject line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="compose-body">Message</Label>
          <Textarea
            id="compose-body"
            placeholder={channel === "sms" ? "Type your SMS…" : "Write your email…"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={channel === "sms" ? 5 : 10}
            className="resize-none"
          />
          {channel === "sms" && message.trim() && (
            <p className="text-[11px] text-muted-foreground">
              Preview: {brandedSMS}
              <br />
              ~{segments} segment{segments === 1 ? "" : "s"}
              {sender ? ` · ${sender.sms_credits} credit(s) left` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="border-t px-6 py-4 flex items-center justify-between gap-2 bg-muted/10">
        {channel === "sms" && smsDisabled ? (
          <p className="text-xs text-amber-600 dark:text-amber-500">No SMS credits — contact support to top up.</p>
        ) : (
          <span />
        )}
        <Button
          onClick={() => sendMutation.mutate()}
          disabled={
            sendMutation.isPending ||
            !message.trim() ||
            (channel === "email" && !subject.trim()) ||
            (!to.trim() && !customerId) ||
            (channel === "email" && emailDisabled) ||
            (channel === "sms" && smsDisabled)
          }
        >
          <Send className="h-4 w-4 mr-2" />
          {sendMutation.isPending ? "Sending…" : "Send"}
        </Button>
      </div>
    </div>
  );
}
