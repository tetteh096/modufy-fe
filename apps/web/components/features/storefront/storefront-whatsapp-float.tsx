"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp-url";
import { resolveMediaUrl } from "@/lib/media-url";
import type { PublicStorefront } from "@/types/api";

const DEFAULT_PROMPT = "Hi there! How can we help you today?";

function WhatsAppLogoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="sf-whatsapp-float-icon" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function BusinessAvatar({ sf }: { sf: PublicStorefront }) {
  if (sf.logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolveMediaUrl(sf.logo_url)}
        alt=""
        className="sf-whatsapp-chat-avatar-img"
      />
    );
  }
  return <span className="sf-whatsapp-chat-avatar-fallback">{sf.business_name.slice(0, 1)}</span>;
}

export function StorefrontWhatsAppFloat({ sf }: { sf: PublicStorefront }) {
  const phone = sf.whatsapp?.trim() ?? "";
  const enabled = sf.show_whatsapp && !!phone && !!buildWhatsAppUrl(phone);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = message.trim();
  const canSend = trimmed.length > 0;

  function handleSend() {
    if (!canSend || !phone) return;
    const href = buildWhatsAppUrl(phone, trimmed);
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
    setMessage("");
  }

  useEffect(() => {
    if (!open || !enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => textareaRef.current?.focus(), 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, enabled]);

  if (!enabled) return null;

  return (
    <div className="sf-whatsapp-widget">
      {open ? (
        <div
          className="sf-whatsapp-chat"
          role="dialog"
          aria-label={`Chat with ${sf.business_name} on WhatsApp`}
        >
          <header className="sf-whatsapp-chat-head">
            <div className="sf-whatsapp-chat-head-profile">
              <span className="sf-whatsapp-chat-avatar sf-whatsapp-chat-avatar-lg">
                <BusinessAvatar sf={sf} />
              </span>
              <div className="sf-whatsapp-chat-head-copy">
                <strong>{sf.business_name}</strong>
                <span>Typically replies on WhatsApp</span>
              </div>
            </div>
            <button
              type="button"
              className="sf-whatsapp-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="sf-whatsapp-chat-body">
            <div className="sf-whatsapp-chat-row">
              <span className="sf-whatsapp-chat-avatar">
                <BusinessAvatar sf={sf} />
              </span>
              <div className="sf-whatsapp-chat-bubble sf-whatsapp-chat-bubble-in">
                <p>{DEFAULT_PROMPT}</p>
              </div>
            </div>
          </div>

          <div className="sf-whatsapp-chat-compose">
            <textarea
              ref={textareaRef}
              className="sf-whatsapp-chat-input"
              rows={3}
              placeholder="Type your message…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="button"
              className="sf-whatsapp-chat-send"
              disabled={!canSend}
              onClick={handleSend}
            >
              <Send className="h-4 w-4" />
              Send on WhatsApp
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className={`sf-whatsapp-float${open ? " sf-whatsapp-float-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp chat" : `Chat with ${sf.business_name} on WhatsApp`}
        aria-expanded={open}
        title="Chat on WhatsApp"
      >
        {open ? <X className="sf-whatsapp-float-icon" /> : <WhatsAppLogoIcon />}
        <span className="sf-whatsapp-float-label">{open ? "Close" : "WhatsApp"}</span>
      </button>
    </div>
  );
}
