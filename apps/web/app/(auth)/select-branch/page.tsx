import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Pool } from "pg";
import { SelectBranchForm } from "@/components/features/branches/select-branch-form";

const dsn = process.env.DATABASE_URL ?? "";
const pool = new Pool({
  connectionString: dsn.includes("sslmode") ? dsn : `${dsn}?sslmode=disable`,
});

export default async function SelectBranchPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login");
  }

  const userResult = await pool.query<{ user_id: string; business_id: string; role_name: string | null }>(
    `SELECT u.id AS user_id, u.business_id::text AS business_id, r.name AS role_name
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     WHERE u.auth_id = $1 AND u.deleted_at IS NULL
     LIMIT 1`,
    [session.user.id],
  );

  const row = userResult.rows[0];
  if (!row) {
    redirect("/onboarding");
  }

  const role = row.role_name ?? "owner";
  const branchResult = await pool.query<{ id: string; name: string; is_default: boolean }>(
    `SELECT b.id::text, b.name, b.is_default
     FROM branches b
     WHERE b.business_id = $1::uuid AND b.deleted_at IS NULL AND b.is_active = true
       AND (
         $2 IN ('owner', 'super_admin')
         OR EXISTS (SELECT 1 FROM user_branches ub WHERE ub.user_id = $3::uuid AND ub.branch_id = b.id)
       )
     ORDER BY b.is_default DESC, b.name ASC`,
    [row.business_id, role, row.user_id],
  );

  const branches = branchResult.rows;
  if (branches.length <= 1) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={null}>
      <SelectBranchForm branches={branches} />
    </Suspense>
  );
}
