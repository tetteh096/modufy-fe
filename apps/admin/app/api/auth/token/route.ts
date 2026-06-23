import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignJWT } from "jose";
import { Pool } from "pg";
import { NextResponse } from "next/server";

const dsn = process.env.DATABASE_URL ?? "";
const pool = new Pool({
  connectionString: dsn.includes("sslmode") ? dsn : `${dsn}?sslmode=disable`,
});
const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const authId = session.user.id;

  const result = await pool.query<{
    user_id: string;
    business_id: string;
    role_name: string | null;
    permissions: string[] | null;
    enabled_modules: string[] | null;
  }>(
    `SELECT
       u.id::text                                                AS user_id,
       u.business_id::text                                       AS business_id,
       r.name                                                    AS role_name,
       ARRAY_REMOVE(ARRAY_AGG(DISTINCT rp.permission_key), NULL) AS permissions,
       ARRAY_REMOVE(ARRAY_AGG(DISTINCT bm.module)
         FILTER (WHERE bm.enabled = true), NULL)                 AS enabled_modules
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN business_modules bm ON bm.business_id = u.business_id
     WHERE u.auth_id = $1 AND u.deleted_at IS NULL
     GROUP BY u.id, u.business_id, r.name
     LIMIT 1`,
    [authId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Admin user not found", code: "NOT_FOUND" }, { status: 404 });
  }

  const row = result.rows[0];

  // Admin app only allows super_admin role
  if (row.role_name !== "super_admin") {
    return NextResponse.json({ error: "Not an admin account", code: "FORBIDDEN" }, { status: 403 });
  }

  const token = await new SignJWT({
    user_id: row.user_id,
    business_id: row.business_id ?? "",
    role: row.role_name,
    permissions: row.permissions ?? [],
    enabled_modules: row.enabled_modules ?? [],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .setSubject(row.user_id)
    .sign(secret);

  return NextResponse.json({ token });
}
