"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";
import { supportApi } from "@/lib/api";
import { useImpersonationStore } from "@/store/impersonation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";

export function SupportSessionBanner() {
  const qc = useQueryClient();
  const { active, scope, clearSession } = useImpersonationStore();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const { data: merchantSessions } = useQuery({
    queryKey: ["support-sessions-active"],
    queryFn: () => supportApi.activeSessions(),
    enabled: !active,
    refetchInterval: 30_000,
  });

  const endSession = useMutation({
    mutationFn: (id: string) => supportApi.endSession(id),
    onSuccess: () => {
      toast.success("Support session ended");
      qc.invalidateQueries({ queryKey: ["support-sessions-active"] });
    },
  });

  if (active) {
    return (
      <div className="bg-destructive text-destructive-foreground px-4 py-2 text-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            Support mode — viewing as merchant ({scope === "read_only" ? "read-only" : "full access"}).
            Do not enter real customer passwords.
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="shrink-0 h-7"
          onClick={() => {
            clearSession();
            clearAuth();
            window.location.href = "/login";
          }}
        >
          Exit
        </Button>
      </div>
    );
  }

  if (!merchantSessions?.length) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-sm flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" />
        <span>
          Modufy support {merchantSessions.length === 1 ? "has an active session" : "has active sessions"} on your account.
        </span>
      </div>
      <div className="flex gap-2">
        {merchantSessions.map((s) => (
          <Button
            key={s.id}
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            disabled={endSession.isPending}
            onClick={() => endSession.mutate(s.id)}
          >
            <X className="h-3 w-3 mr-1" />
            End session
          </Button>
        ))}
      </div>
    </div>
  );
}
