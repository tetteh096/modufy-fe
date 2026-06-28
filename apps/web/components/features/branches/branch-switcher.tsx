"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { branchesApi } from "@/lib/api";
import { selectBranch } from "@/lib/auth-session";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function BranchSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const activeBranchId = useAuthStore((s) => s.activeBranchId);
  const activeBranchName = useAuthStore((s) => s.activeBranchName);
  const branches = useAuthStore((s) => s.branches);
  const [switching, setSwitching] = useState(false);

  const { data: mine } = useQuery({
    queryKey: ["branches-mine"],
    queryFn: () => branchesApi.mine(),
    staleTime: 60_000,
  });

  const options = (mine?.branches?.length ? mine.branches : branches) ?? [];
  if (options.length <= 1) return null;

  async function onSelect(branchId: string, branchName: string) {
    if (branchId === activeBranchId || switching) return;
    setSwitching(true);
    const ok = await selectBranch(branchId);
    setSwitching(false);
    if (!ok) {
      toast.error("Could not switch branch");
      return;
    }
    toast.success(`Now working in ${branchName}`);
    await qc.invalidateQueries();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 gap-1.5 max-w-[200px] font-normal", className)}
            disabled={switching}
          />
        }
      >
        <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate text-xs">{activeBranchName ?? "Branch"}</span>
        <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {options.map((b) => (
          <DropdownMenuItem key={b.id} onClick={() => onSelect(b.id, b.name)}>
            <span className="flex-1 truncate">{b.name}</span>
            {b.id === activeBranchId && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
