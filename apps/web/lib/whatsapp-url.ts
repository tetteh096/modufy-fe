/** Digits only for wa.me links (country code included, no +). */
export function whatsAppDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Opens WhatsApp chat with optional pre-filled message. */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const digits = whatsAppDigits(phone);
  if (!digits) return "";
  const base = `https://wa.me/${digits}`;
  const text = message?.trim();
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
