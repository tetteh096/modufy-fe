import { betterAuth } from "better-auth";
import { createPgPool } from "@/lib/pg";

export const auth = betterAuth({
  database: createPgPool(),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"],
});
