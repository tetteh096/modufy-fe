import { Pool, type PoolConfig } from "pg";

/** Build a pg Pool config that works for local Docker and Heroku/RDS SSL. */
export function pgPoolConfig(dsn = process.env.DATABASE_URL ?? ""): PoolConfig {
  const isLocal = /localhost|127\.0\.0\.1/.test(dsn);
  let connectionString = dsn;
  if (dsn && !dsn.includes("sslmode=")) {
    connectionString = `${dsn}${dsn.includes("?") ? "&" : "?"}sslmode=${isLocal ? "disable" : "require"}`;
  }
  const useSSL = Boolean(dsn) && !isLocal && !connectionString.includes("sslmode=disable");
  return {
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  };
}

export function createPgPool(dsn?: string) {
  return new Pool(pgPoolConfig(dsn));
}
