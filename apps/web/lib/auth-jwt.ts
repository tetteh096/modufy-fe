import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

export async function mintBizOSToken(payload: {
  user_id: string;
  business_id: string;
  role: string;
  permissions: string[];
  enabled_modules: string[];
  active_branch_id?: string;
  expiresIn?: string;
}) {
  const claims: Record<string, unknown> = {
    user_id: payload.user_id,
    business_id: payload.business_id,
    role: payload.role,
    permissions: payload.permissions,
    enabled_modules: payload.enabled_modules,
  };
  if (payload.active_branch_id) {
    claims.active_branch_id = payload.active_branch_id;
  }

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresIn ?? "24h")
    .setSubject(payload.user_id)
    .sign(secret);
}

export function applyPermissionOverrides(
  permissions: string[],
  roleName: string | null,
  overrides: { permission_key: string; allowed: boolean }[],
) {
  let result = permissions ?? [];
  if (roleName === "super_admin" && result.length === 0) {
    result = ["*"];
  }
  if (overrides.length > 0) {
    const set = new Set(result);
    for (const o of overrides) {
      if (o.allowed) set.add(o.permission_key);
      else set.delete(o.permission_key);
    }
    result = [...set].sort();
  }
  return result;
}
