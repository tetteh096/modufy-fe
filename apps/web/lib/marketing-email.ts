/** Sample merge data for marketing email previews in the dashboard. */
export const MARKETING_PREVIEW_DATA = {
  first_name: "Ama",
  customer_name: "Ama Mensah",
  business_name: "Your Business",
  unsubscribe_url: "#",
} as const;

/** Replace {{token}} placeholders (same tokens the API render step uses). */
export function renderMarketingMergeTags(
  text: string,
  data: Record<string, string> = MARKETING_PREVIEW_DATA,
): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => data[key] ?? `{{${key}}}`);
}

/** Strip HTML for SMS-style snippets on cards. */
export function marketingPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Wrap partial email HTML in a newsletter shell for preview when the body
 * does not already look like a full layout.
 */
export function wrapNewsletterPreviewHtml(body: string, businessName?: string): string {
  const trimmed = body.trim();
  if (!trimmed) {
    return wrapNewsletterPreviewHtml(
      "<p style='margin:0;color:#6b7280'>Your newsletter content will appear here.</p>",
      businessName,
    );
  }

  if (/max-width:\s*5|max-width:\s*6|class=["']email-shell/i.test(trimmed)) {
    return renderMarketingMergeTags(trimmed, {
      ...MARKETING_PREVIEW_DATA,
      business_name: businessName || MARKETING_PREVIEW_DATA.business_name,
    });
  }

  const brand = businessName || MARKETING_PREVIEW_DATA.business_name;
  const content = renderMarketingMergeTags(trimmed, {
    ...MARKETING_PREVIEW_DATA,
    business_name: brand,
  });

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="margin:0;padding:0;background:#eef2ef;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2ef;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
<tr><td style="background:linear-gradient(135deg,#166534 0%,#15803d 100%);padding:28px 32px;text-align:center;">
<p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">${brand}</p>
</td></tr>
<tr><td style="padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;line-height:1.65;font-size:16px;">
${content}
</td></tr>
<tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">
<p style="margin:0 0 8px;">You are receiving this because you are a customer of ${brand}.</p>
<p style="margin:0;"><a href="${MARKETING_PREVIEW_DATA.unsubscribe_url}" style="color:#166534;text-decoration:underline;">Unsubscribe</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/** Starter block merchants can paste into the HTML editor. */
export const EMAIL_CONTENT_SNIPPETS = [
  {
    id: "greeting",
    label: "Greeting",
    html: `<p style="margin:0 0 16px;">Hi {{first_name}},</p>`,
  },
  {
    id: "cta",
    label: "Green button",
    html: `<p style="margin:24px 0;text-align:center;"><a href="#" style="display:inline-block;background:#166534;color:#ffffff;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:8px;font-size:16px;">Shop now</a></p>`,
  },
  {
    id: "offer",
    label: "Offer box",
    html: `<div style="margin:20px 0;padding:20px 24px;background:#ecfdf3;border:1px solid #bbf7d0;border-radius:10px;text-align:center;"><p style="margin:0 0 6px;font-size:13px;color:#166534;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Limited time</p><p style="margin:0;font-size:22px;font-weight:700;color:#14532d;">10% off this week</p></div>`,
  },
  {
    id: "divider",
    label: "Divider",
    html: `<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />`,
  },
] as const;
