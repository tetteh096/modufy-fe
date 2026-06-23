import { Badge } from "@/components/ui/badge";
import { formatTeamRole } from "@/lib/team-roles";
import { cn } from "@/lib/utils";

const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  owner: "default",
  manager: "secondary",
  staff: "outline",
  accountant: "outline",
};

export function TeamRoleBadge({ role, className }: { role: string; className?: string }) {
  return (
    <Badge
      variant={ROLE_VARIANT[role] ?? "secondary"}
      className={cn("text-xs capitalize shrink-0", className)}
    >
      {formatTeamRole(role)}
    </Badge>
  );
}
