import { Pool, type PoolConfig } from "pg";

/** Strip sslmode from a DSN so Pool `ssl` options are not overridden. */
function stripSslMode(dsn: string): string {
  return dsn
    .replace(/([?&])sslmode=[^&]*/gi, "$1")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "")
    .replace(/\?&/, "?");
}

/**
 * Build a pg Pool config that works for local Docker and Heroku/RDS.
 * Prefer Pool `ssl` over `sslmode=` in the URL — recent `pg` maps
 * `sslmode=require` to verify-full and breaks on Heroku certs.
 */
export function pgPoolConfig(dsn = process.env.DATABASE_URL ?? ""): PoolConfig {
  const isLocal = /localhost|127\.0\.0\.1/.test(dsn);
  const connectionString = stripSslMode(dsn);
  return {
    connectionString,
    ssl: isLocal || !dsn ? undefined : { rejectUnauthorized: false },
  };
}

export function createPgPool(dsn?: string) {
  return new Pool(pgPoolConfig(dsn));
}
