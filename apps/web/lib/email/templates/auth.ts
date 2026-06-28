import {
  authEmailLayout,
  emailButton,
  emailOtpBlock,
  emailParagraph,
} from "@/lib/email/templates/auth-layout";

export type AuthEmailKind =
  | "reset-password"
  | "verify-email"
  | "sign-in-otp"
  | "verify-email-otp"
  | "reset-password-otp";

type AuthEmailContent = {
  subject: string;
  previewText: string;
  title: string;
  text: string;
  html: string;
};

type BuildAuthEmailInput = {
  kind: AuthEmailKind;
  url?: string;
  otp?: string;
};

const copy: Record<
  AuthEmailKind,
  Omit<BuildAuthEmailInput, "kind"> & {
    buttonLabel?: string;
    intro: string;
    preview: string;
    title: string;
    subject: string;
  }
> = {
  "reset-password": {
    intro: "We received a request to reset the password for your Modufy account.",
    preview: "Reset your Modufy password",
    title: "Reset your password",
    subject: "Reset your Modufy password",
    buttonLabel: "Reset password",
  },
  "verify-email": {
    intro: "Thanks for signing up. Confirm your email address to finish setting up your account.",
    preview: "Verify your Modufy email address",
    title: "Verify your email",
    subject: "Verify your Modufy email",
    buttonLabel: "Verify email",
  },
  "sign-in-otp": {
    intro: "Use this one-time code to sign in to your Modufy account.",
    preview: "Your Modufy sign-in code",
    title: "Sign-in code",
    subject: "Your Modufy sign-in code",
  },
  "verify-email-otp": {
    intro: "Enter this code to verify your email address on Modufy.",
    preview: "Verify your Modufy email",
    title: "Email verification code",
    subject: "Verify your Modufy email",
  },
  "reset-password-otp": {
    intro: "Use this one-time code to reset your Modufy password.",
    preview: "Reset your Modufy password",
    title: "Password reset code",
    subject: "Reset your Modufy password",
  },
};

export function buildAuthEmail({ kind, url, otp }: BuildAuthEmailInput): AuthEmailContent {
  const meta = copy[kind];
  const bodyParts = [emailParagraph(meta.intro)];

  if (url && meta.buttonLabel) {
    bodyParts.push(emailButton(url, meta.buttonLabel));
    bodyParts.push(
      emailParagraph("This link expires soon. If it stops working, request a new one from Modufy."),
    );
  }

  if (otp) {
    bodyParts.push(emailOtpBlock(otp));
  }

  const textLines = [meta.intro, ""];
  if (url) {
    textLines.push(`${meta.buttonLabel ?? "Open link"}: ${url}`, "");
  }
  if (otp) {
    textLines.push(`Your code: ${otp}`, "", "This code expires in 10 minutes.", "");
  }
  textLines.push("If you did not request this email, you can safely ignore it.", "", "— Modufy");

  return {
    subject: meta.subject,
    previewText: meta.preview,
    title: meta.title,
    text: textLines.join("\n"),
    html: authEmailLayout({
      previewText: meta.preview,
      title: meta.title,
      bodyHtml: bodyParts.join(""),
    }),
  };
}
