"use client";

import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { branchesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BranchReportFilterProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/** Filters sales/expenses reports by branch. Hidden for single-location businesses. */
export function BranchReportFilter({ value, onChange, className }: BranchReportFilterProps) {
  const storedBranches = useAuthStore((s) => s.branches);
  const { data: mine } = useQuery({
    queryKey: ["branches-mine"],
    queryFn: () => branchesApi.mine(),
    staleTime: 60_000,
  });

  const options = (mine?.branches?.length ? mine.branches : storedBranches) ?? [];
  if (options.length <= 1) return null;

  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className={className ?? "w-[180px] h-9"}>
        <Building2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
        <SelectValue placeholder="All branches" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All branches</SelectItem>
        {options.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function branchApiParams(branchFilter: string): { branch_id?: string } {
  if (!branchFilter || branchFilter === "all") {
    return { branch_id: "all" };
  }
  return { branch_id: branchFilter };
}
