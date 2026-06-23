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

  // Look up the user in our users table by auth_id
  const result = await pool.query<{
    user_id: string;
    business_id: string;
    role_name: string | null;
    role_id: string | null;
    permissions: string[] | null;
    enabled_modules: string[] | null;
  }>(
    `SELECT
       u.id                                                  AS user_id,
       u.business_id::text                                   AS business_id,
       r.name                                                AS role_name,
       r.id::text                                            AS role_id,
       COALESCE(
         CASE
           WHEN EXISTS (
             SELECT 1 FROM business_role_permissions brp
             WHERE brp.business_id = u.business_id AND brp.role_id = r.id
           ) THEN (
             SELECT ARRAY_REMOVE(ARRAY_AGG(brp.permission_key ORDER BY brp.permission_key), NULL)
             FROM business_role_permissions brp
             WHERE brp.business_id = u.business_id AND brp.role_id = r.id
           )
           ELSE ARRAY_REMOVE(ARRAY_AGG(DISTINCT rp.permission_key), NULL)
         END,
         ARRAY[]::text[]
       )                                                     AS permissions,
       ARRAY_REMOVE(ARRAY_AGG(DISTINCT bm.module)
         FILTER (WHERE bm.enabled = true), NULL)             AS enabled_modules
     FROM users u
     LEFT JOIN user_roles  ur ON ur.user_id  = u.id
     LEFT JOIN roles        r  ON r.id        = ur.role_id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
       AND NOT EXISTS (
         SELECT 1 FROM business_role_permissions brp
         WHERE brp.business_id = u.business_id AND brp.role_id = r.id
       )
     LEFT JOIN business_modules bm ON bm.business_id = u.business_id
     WHERE u.auth_id = $1
       AND u.deleted_at IS NULL
     GROUP BY u.id, u.business_id, r.name, r.id
     LIMIT 1`,
    [authId]
  );

  // Pre-onboarding: user exists in Better Auth but hasn't created a business yet
  if (result.rows.length === 0) {
    const token = await new SignJWT({
      user_id: authId,
      business_id: "",
      role: "pending_onboarding",
      permissions: [],
      enabled_modules: [],
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .setSubject(authId)
      .sign(secret);

    return NextResponse.json({ token, onboarding_required: true, business_id: "" });
  }

  const row = result.rows[0];

  const overrideResult = await pool.query<{ permission_key: string; allowed: boolean }>(
    `SELECT permission_key, allowed
     FROM business_user_permissions
     WHERE business_id = $1::uuid AND user_id = $2::uuid`,
    [row.business_id, row.user_id]
  );

  let permissions = row.permissions ?? [];
  if (row.role_name === "super_admin" && permissions.length === 0) {
    permissions = ["*"];
  }
  if (overrideResult.rows.length > 0) {
    const set = new Set(permissions);
    for (const o of overrideResult.rows) {
      if (o.allowed) set.add(o.permission_key);
      else set.delete(o.permission_key);
    }
    permissions = [...set].sort();
  }

  await pool.query(
    `UPDATE users SET last_seen_at = NOW(), updated_at = NOW() WHERE id = $1::uuid`,
    [row.user_id],
  );

  await pool.query(
    `INSERT INTO audit_events (
       id, business_id, actor_user_id, action, resource_type, description, created_at
     )
     SELECT gen_random_uuid(), $1::uuid, $2::uuid, 'auth.sign_in', 'session', 'Signed in to BizOS', NOW()
     WHERE NOT EXISTS (
       SELECT 1 FROM audit_events
       WHERE business_id = $1::uuid
         AND actor_user_id = $2::uuid
         AND action = 'auth.sign_in'
         AND created_at > NOW() - INTERVAL '1 hour'
     )`,
    [row.business_id, row.user_id],
  );

  const token = await new SignJWT({
    user_id: row.user_id,
    business_id: row.business_id,
    role: row.role_name ?? "owner",
    permissions,
    enabled_modules: row.enabled_modules ?? [],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .setSubject(row.user_id)
    .sign(secret);

  return NextResponse.json({
    token,
    onboarding_required: false,
    business_id: row.business_id,
  });
}
