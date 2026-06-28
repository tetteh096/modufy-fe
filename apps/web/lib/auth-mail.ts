import { Resend } from "resend";
import { buildAuthEmail, type AuthEmailKind } from "@/lib/email/templates/auth";

export type AuthMailPayload = {
  to: string;
  kind: AuthEmailKind;
  url?: string;
  otp?: string;
};

function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && emailFrom());
}

function emailFrom(): string | undefined {
  return process.env.RESEND_FROM ?? process.env.EMAIL_FROM ?? process.env.SMTP_FROM;
}

function logToConsole(payload: AuthMailPayload, content: ReturnType<typeof buildAuthEmail>) {
  const lines = [
    "──────── Modufy Auth Mail (console fallback) ────────",
    `To: ${payload.to}`,
    `Kind: ${payload.kind}`,
    `Subject: ${content.subject}`,
  ];
  if (payload.url) lines.push(`Link: ${payload.url}`);
  if (payload.otp) lines.push(`OTP: ${payload.otp}`);
  lines.push("────────────────────────────────────────────────────");
  console.info(lines.join("\n"));
}

/** Sends auth mail via Resend when configured; otherwise logs to the server console. */
export async function sendAuthMail(payload: AuthMailPayload) {
  const content = buildAuthEmail(payload);

  if (!resendConfigured()) {
    logToConsole(payload, content);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: emailFrom()!,
    to: payload.to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  if (error) {
    throw new Error(`resend: ${error.message}`);
  }
}
