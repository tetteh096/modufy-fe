import { betterAuth } from "better-auth";
import { Pool } from "pg";

function makePool() {
  const dsn = process.env.DATABASE_URL ?? "";
  const connectionString = dsn.includes("sslmode") ? dsn : `${dsn}?sslmode=disable`;
  return new Pool({ connectionString });
}

export const auth = betterAuth({
  database: makePool(),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"],
});
