import { Badge } from "@/components/ui/badge";
import { formatTeamRole } from "@/lib/team-roles";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<string, string> = {
  owner: "bg-slate-900 text-slate-100 hover:bg-slate-900/90 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-100/90 border-transparent",
  manager: "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/30 hover:bg-sky-50 dark:hover:bg-sky-950/30",
  staff: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
  accountant: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30 hover:bg-amber-50 dark:hover:bg-amber-950/30",
};

export function TeamRoleBadge({ role, className }: { role: string; className?: string }) {
  const styles = ROLE_STYLES[role] ?? "bg-muted text-muted-foreground border-border";
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-bold tracking-wide uppercase shrink-0 px-2 py-0.5 rounded-md", styles, className)}
    >
      {formatTeamRole(role)}
    </Badge>
  );
}
