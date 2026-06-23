/** System roles — matches services/api seed (owner is assigned at onboarding, not via invite). */

export type InvitableTeamRole = "manager" | "staff" | "accountant";

export type TeamRoleId =
  | "owner"
  | "manager"
  | "staff"
  | "accountant"
  | InvitableTeamRole;

export const TEAM_ROLE_META: Record<
  TeamRoleId,
  { label: string; description: string; invitable: boolean }
> = {
  owner: {
    label: "Owner",
    description: "Full access — billing, modules, and team. One per business.",
    invitable: false,
  },
  manager: {
    label: "Manager",
    description: "Runs day-to-day operations. Cannot change billing or ownership.",
    invitable: true,
  },
  staff: {
    label: "Staff",
    description: "Sales, customers, invoices, and bookings. No financial reports.",
    invitable: true,
  },
  accountant: {
    label: "Accountant",
    description: "View exports, tax summaries, and read-only financials.",
    invitable: true,
  },
};

export const INVITABLE_ROLES: InvitableTeamRole[] = ["manager", "staff", "accountant"];

export function formatTeamRole(role: string, displayName?: string): string {
  if (displayName) return displayName;
  return TEAM_ROLE_META[role as TeamRoleId]?.label ?? humanizeRoleSlug(role);
}

export function roleDescription(role: string, description?: string): string {
  if (description) return description;
  return TEAM_ROLE_META[role as TeamRoleId]?.description ?? "";
}

function humanizeRoleSlug(slug: string): string {
  return slug
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
