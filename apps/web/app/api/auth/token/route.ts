import { auth } from "@/lib/auth";
import { applyPermissionOverrides, mintBizOSToken } from "@/lib/auth-jwt";
import { createPgPool } from "@/lib/pg";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const pool = createPgPool();

const USER_QUERY = `SELECT
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
     LIMIT 1`;

const BRANCHES_QUERY = `SELECT b.id::text, b.name, b.is_default
     FROM branches b
     WHERE b.business_id = $1::uuid
       AND b.deleted_at IS NULL
       AND b.is_active = true
       AND (
         $2 IN ('owner', 'super_admin')
         OR EXISTS (
           SELECT 1 FROM user_branches ub
           WHERE ub.user_id = $3::uuid AND ub.branch_id = b.id
         )
       )
     ORDER BY b.is_default DESC, b.name ASC`;

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const authId = session.user.id;
  const { searchParams } = new URL(request.url);
  const requestedBranchId = searchParams.get("branch_id")?.trim() || "";

  const result = await pool.query<{
    user_id: string;
    business_id: string;
    role_name: string | null;
    role_id: string | null;
    permissions: string[] | null;
    enabled_modules: string[] | null;
  }>(USER_QUERY, [authId]);

  if (result.rows.length === 0) {
    const token = await mintBizOSToken({
      user_id: authId,
      business_id: "",
      role: "pending_onboarding",
      permissions: [],
      enabled_modules: [],
      expiresIn: "2h",
    });

    return NextResponse.json({ token, onboarding_required: true, business_id: "" });
  }

  const row = result.rows[0];

  const overrideResult = await pool.query<{ permission_key: string; allowed: boolean }>(
    `SELECT permission_key, allowed
     FROM business_user_permissions
     WHERE business_id = $1::uuid AND user_id = $2::uuid`,
    [row.business_id, row.user_id],
  );

  const permissions = applyPermissionOverrides(
    row.permissions ?? [],
    row.role_name,
    overrideResult.rows,
  );

  const role = row.role_name ?? "owner";
  const branchResult = await pool.query<{ id: string; name: string; is_default: boolean }>(
    BRANCHES_QUERY,
    [row.business_id, role, row.user_id],
  );
  const branches = branchResult.rows;

  if (branches.length === 0) {
    return NextResponse.json(
      { error: "No branch access configured", code: "NO_BRANCH_ACCESS" },
      { status: 403 },
    );
  }

  let activeBranch = branches.find((b) => b.id === requestedBranchId);
  if (!activeBranch && branches.length === 1) {
    activeBranch = branches[0];
  }

  if (!activeBranch && branches.length > 1) {
    return NextResponse.json({
      requires_branch_selection: true,
      business_id: row.business_id,
      branches: branches.map((b) => ({
        id: b.id,
        name: b.name,
        is_default: b.is_default,
      })),
    });
  }

  if (!activeBranch) {
    return NextResponse.json({ error: "Invalid branch", code: "INVALID_BRANCH" }, { status: 400 });
  }

  await pool.query(`UPDATE users SET last_seen_at = NOW(), updated_at = NOW() WHERE id = $1::uuid`, [
    row.user_id,
  ]);

  const token = await mintBizOSToken({
    user_id: row.user_id,
    business_id: row.business_id,
    role,
    permissions,
    enabled_modules: row.enabled_modules ?? [],
    active_branch_id: activeBranch.id,
  });

  return NextResponse.json({
    token,
    onboarding_required: false,
    business_id: row.business_id,
    active_branch_id: activeBranch.id,
    active_branch_name: activeBranch.name,
    branches: branches.map((b) => ({
      id: b.id,
      name: b.name,
      is_default: b.is_default,
    })),
  });
}
