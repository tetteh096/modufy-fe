import { betterAuth } from "better-auth";
import { emailOTP, twoFactor } from "better-auth/plugins";
import { createPgPool } from "@/lib/pg";
import { sendAuthMail } from "@/lib/auth-mail";

const appURL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  database: createPgPool(),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: appURL,
  appName: "Modufy",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthMail({
        to: user.email,
        kind: "reset-password",
        url,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthMail({
        to: user.email,
        kind: "verify-email",
        url,
      });
    },
    sendOnSignUp: true,
  },
  trustedOrigins: [appURL],
  plugins: [
    twoFactor({ issuer: "Modufy" }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const kind =
          type === "sign-in"
            ? "sign-in-otp"
            : type === "email-verification"
              ? "verify-email-otp"
              : "reset-password-otp";
        await sendAuthMail({
          to: email,
          kind,
          otp,
        });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
