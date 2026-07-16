import pg from "pg";

const { Pool } = pg;
const dsn = process.env.DATABASE_URL;

if (!dsn) {
  throw new Error("DATABASE_URL is required");
}

const isLocal = /localhost|127\.0\.0\.1/.test(dsn);
const connectionString = dsn
  .replace(/([?&])sslmode=[^&]*/gi, "$1")
  .replace(/\?&/, "?")
  .replace(/[?&]$/, "");

const pool = new Pool({
  connectionString,
  ssl: isLocal ? undefined : { rejectUnauthorized: false },
});

try {
  await pool.query("BEGIN");
  await pool.query(`
    ALTER TABLE "user"
    ADD COLUMN IF NOT EXISTS "twoFactorEnabled" boolean NOT NULL DEFAULT false
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "twoFactor" (
      "id" text PRIMARY KEY,
      "secret" text NOT NULL,
      "backupCodes" text NOT NULL,
      "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS "twoFactor_secret_idx"
    ON "twoFactor" ("secret")
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS "twoFactor_userId_idx"
    ON "twoFactor" ("userId")
  `);
  await pool.query("COMMIT");
  console.log("Better Auth two-factor schema is up to date.");
} catch (error) {
  await pool.query("ROLLBACK");
  throw error;
} finally {
  await pool.end();
}
