import { betterAuth } from "better-auth";
import { emailOTP, twoFactor } from "better-auth/plugins";
import { Pool } from "pg";
import { sendAuthMail } from "@/lib/auth-mail";

function makePool() {
  const dsn = process.env.DATABASE_URL ?? "";
  const connectionString = dsn.includes("sslmode") ? dsn : `${dsn}?sslmode=disable`;
  return new Pool({ connectionString });
}

const appURL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  database: makePool(),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: appURL,
  appName: "BizOS",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthMail({
        to: user.email,
        subject: "Reset your BizOS password",
        url,
        body: "Use the link above to set a new password.",
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthMail({
        to: user.email,
        subject: "Verify your BizOS email",
        url,
        body: "Click the link to confirm your email address.",
      });
    },
    sendOnSignUp: true,
  },
  trustedOrigins: [appURL],
  plugins: [
    twoFactor({ issuer: "BizOS" }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in"
            ? "Your BizOS sign-in code"
            : type === "email-verification"
              ? "Verify your BizOS email"
              : "Reset your BizOS password";
        await sendAuthMail({
          to: email,
          subject,
          otp,
          body: `Your one-time code is ${otp}. It expires shortly.`,
        });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
