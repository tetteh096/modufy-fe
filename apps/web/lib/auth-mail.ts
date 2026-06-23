import nodemailer from "nodemailer";

type AuthMailPayload = {
  to: string;
  subject: string;
  url?: string;
  otp?: string;
  body?: string;
};

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

function buildHtml(payload: AuthMailPayload): string {
  const parts: string[] = [
    `<p style="font-family:system-ui,sans-serif;font-size:15px;color:#0f172a;">`,
  ];

  if (payload.body) {
    parts.push(`${payload.body}</p>`);
  } else {
    parts.push("Use the details below to continue.</p>");
  }

  if (payload.url) {
    parts.push(
      `<p style="font-family:system-ui,sans-serif;font-size:15px;">`,
      `<a href="${payload.url}" style="color:#2563eb;font-weight:600;">Open this link</a>`,
      `</p>`,
      `<p style="font-family:system-ui,sans-serif;font-size:12px;color:#64748b;word-break:break-all;">${payload.url}</p>`
    );
  }

  if (payload.otp) {
    parts.push(
      `<p style="font-family:system-ui,sans-serif;font-size:28px;font-weight:700;letter-spacing:0.2em;color:#0f172a;">${payload.otp}</p>`,
      `<p style="font-family:system-ui,sans-serif;font-size:13px;color:#64748b;">This code expires shortly.</p>`
    );
  }

  parts.push(
    `<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />`,
    `<p style="font-family:system-ui,sans-serif;font-size:12px;color:#94a3b8;">BizOS — business management for Ghana</p>`
  );

  return parts.join("");
}

function buildText(payload: AuthMailPayload): string {
  const lines = [payload.body ?? "Use the details below to continue.", ""];
  if (payload.url) lines.push(payload.url, "");
  if (payload.otp) lines.push(`Your code: ${payload.otp}`, "");
  lines.push("— BizOS");
  return lines.join("\n");
}

function logToConsole(payload: AuthMailPayload) {
  const lines = [
    "──────── BizOS Auth Mail (console fallback) ────────",
    `To: ${payload.to}`,
    `Subject: ${payload.subject}`,
  ];
  if (payload.url) lines.push(`Link: ${payload.url}`);
  if (payload.otp) lines.push(`OTP: ${payload.otp}`);
  if (payload.body) lines.push(payload.body);
  lines.push("────────────────────────────────────────────────────");
  console.info(lines.join("\n"));
}

/** Sends auth mail via SMTP when configured; otherwise logs to the server console. */
export async function sendAuthMail(payload: AuthMailPayload) {
  if (!smtpConfigured()) {
    logToConsole(payload);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: payload.to,
    subject: payload.subject,
    text: buildText(payload),
    html: buildHtml(payload),
  });
}
