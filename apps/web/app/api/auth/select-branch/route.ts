import { auth } from "@/lib/auth";
import { applyPermissionOverrides, mintBizOSToken } from "@/lib/auth-jwt";
import { headers } from "next/headers";
import { Pool } from "pg";
import { NextResponse } from "next/server";

const dsn = process.env.DATABASE_URL ?? "";
const pool = new Pool({
  connectionString: dsn.includes("sslmode") ? dsn : `${dsn}?sslmode=disable`,
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = (await request.json()) as { branch_id?: string };
  const branchId = body.branch_id?.trim();
  if (!branchId) {
    return NextResponse.json({ error: "branch_id is required", code: "VALIDATION_ERROR" }, { status: 400 });
  }

  const authId = session.user.id;

  const userResult = await pool.query<{
    user_id: string;
    business_id: string;
    role_name: string | null;
    permissions: string[] | null;
    enabled_modules: string[] | null;
  }>(
    `SELECT
       u.id AS user_id,
       u.business_id::text AS business_id,
       r.name AS role_name,
       COALESCE(
         CASE
           WHEN EXISTS (
             SELECT 1 FROM business_role_permissions brp
             JOIN user_roles ur ON ur.role_id = brp.role_id AND ur.user_id = u.id
             WHERE brp.business_id = u.business_id
           ) THEN (
             SELECT ARRAY_REMOVE(ARRAY_AGG(brp.permission_key ORDER BY brp.permission_key), NULL)
             FROM business_role_permissions brp
             JOIN user_roles ur ON ur.role_id = brp.role_id AND ur.user_id = u.id
             WHERE brp.business_id = u.business_id
           )
           ELSE (
             SELECT ARRAY_REMOVE(ARRAY_AGG(DISTINCT rp.permission_key), NULL)
             FROM role_permissions rp
             JOIN user_roles ur ON ur.role_id = rp.role_id
             WHERE ur.user_id = u.id
           )
         END,
         ARRAY[]::text[]
       ) AS permissions,
       ARRAY_REMOVE(ARRAY_AGG(DISTINCT bm.module) FILTER (WHERE bm.enabled = true), NULL) AS enabled_modules
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     LEFT JOIN business_modules bm ON bm.business_id = u.business_id
     WHERE u.auth_id = $1 AND u.deleted_at IS NULL
     GROUP BY u.id, u.business_id, r.name
     LIMIT 1`,
    [authId],
  );

  const row = userResult.rows[0];
  if (!row) {
    return NextResponse.json({ error: "User not onboarded", code: "NOT_ONBOARDED" }, { status: 400 });
  }

  const role = row.role_name ?? "owner";

  const branchResult = await pool.query<{ id: string; name: string }>(
    `SELECT b.id::text, b.name
     FROM branches b
     WHERE b.id = $1::uuid
       AND b.business_id = $2::uuid
       AND b.deleted_at IS NULL
       AND b.is_active = true
       AND (
         $3 IN ('owner', 'super_admin')
         OR EXISTS (
           SELECT 1 FROM user_branches ub
           WHERE ub.user_id = $4::uuid AND ub.branch_id = b.id
         )
       )
     LIMIT 1`,
    [branchId, row.business_id, role, row.user_id],
  );

  const branch = branchResult.rows[0];
  if (!branch) {
    return NextResponse.json({ error: "Branch not found or access denied", code: "FORBIDDEN" }, { status: 403 });
  }

  const overrideResult = await pool.query<{ permission_key: string; allowed: boolean }>(
    `SELECT permission_key, allowed
     FROM business_user_permissions
     WHERE business_id = $1::uuid AND user_id = $2::uuid`,
    [row.business_id, row.user_id],
  );

  const permissions = applyPermissionOverrides(row.permissions ?? [], row.role_name, overrideResult.rows);

  const token = await mintBizOSToken({
    user_id: row.user_id,
    business_id: row.business_id,
    role,
    permissions,
    enabled_modules: row.enabled_modules ?? [],
    active_branch_id: branch.id,
  });

  return NextResponse.json({
    token,
    business_id: row.business_id,
    active_branch_id: branch.id,
    active_branch_name: branch.name,
  });
}
