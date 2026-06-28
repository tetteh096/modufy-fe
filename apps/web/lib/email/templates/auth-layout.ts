/** Shared inline styles for auth transactional emails (email-client safe). */

export const emailColors = {
  primary: "#16a34a",
  primaryDark: "#15803d",
  background: "#f1f5f9",
  card: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  otpBg: "#f8fafc",
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type AuthEmailLayoutOptions = {
  previewText: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
};

/** Wraps auth email body in a consistent Modufy-branded layout. */
export function authEmailLayout({
  previewText,
  title,
  bodyHtml,
  footerNote = "If you did not request this email, you can safely ignore it.",
}: AuthEmailLayoutOptions): string {
  const safePreview = escapeHtml(previewText);
  const safeTitle = escapeHtml(title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${safeTitle}</title>
  <!--[if mso]><style>table{border-collapse:collapse;}td{font-family:Arial,sans-serif;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${emailColors.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreview}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${emailColors.background};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:${emailColors.card};border:1px solid ${emailColors.border};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid ${emailColors.border};">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:${emailColors.primary};">Modufy</p>
              <p style="margin:6px 0 0;font-size:13px;color:${emailColors.muted};">Business management for Ghana</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;line-height:1.35;color:${emailColors.text};">${safeTitle}</h1>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:${emailColors.muted};">${escapeHtml(footerNote)}</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">&copy; ${new Date().getFullYear()} Modufy</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(href: string, label: string): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
  <tr>
    <td style="border-radius:8px;background-color:${emailColors.primary};">
      <a href="${safeHref}" target="_blank" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${safeLabel}</a>
    </td>
  </tr>
</table>
<p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:${emailColors.muted};word-break:break-all;">Or copy this link:<br /><a href="${safeHref}" style="color:${emailColors.primary};">${safeHref}</a></p>`;
}

export function emailOtpBlock(code: string): string {
  const safeCode = escapeHtml(code);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
  <tr>
    <td align="center" style="padding:20px;background-color:${emailColors.otpBg};border:1px dashed ${emailColors.border};border-radius:10px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${emailColors.muted};">Your code</p>
      <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:0.35em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;color:${emailColors.text};">${safeCode}</p>
    </td>
  </tr>
</table>
<p style="margin:0;font-size:13px;line-height:1.5;color:${emailColors.muted};">This code expires in 10 minutes. Never share it with anyone.</p>`;
}

export function emailParagraph(text: string): string {
  return `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${emailColors.text};">${escapeHtml(text)}</p>`;
}
