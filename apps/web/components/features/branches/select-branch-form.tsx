"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { selectBranch } from "@/lib/auth-session";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BranchOption = {
  id: string;
  name: string;
  is_default?: boolean;
};

export function SelectBranchForm({ branches }: { branches: BranchOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [selected, setSelected] = useState(
    () => branches.find((b) => b.is_default)?.id ?? branches[0]?.id ?? "",
  );
  const [loading, setLoading] = useState(false);

  async function onContinue() {
    if (!selected) return;
    setLoading(true);
    const ok = await selectBranch(selected);
    setLoading(false);
    if (!ok) {
      toast.error("Could not enter that branch");
      return;
    }
    toast.success("Branch selected");
    if (next && next.startsWith("/")) {
      router.push(next);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <AuthPageShell
      title="Choose a branch"
      description="Select which location you want to work in today."
    >
      <div className="space-y-3">
        {branches.map((branch) => {
          const active = branch.id === selected;
          return (
            <button
              key={branch.id}
              type="button"
              onClick={() => setSelected(branch.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm">{branch.name}</p>
                {branch.is_default && (
                  <p className="text-xs text-muted-foreground">Default branch</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Button className="w-full mt-6" onClick={onContinue} disabled={!selected || loading}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size="sm" />
            Entering…
          </span>
        ) : (
          "Continue"
        )}
      </Button>
    </AuthPageShell>
  );
}
