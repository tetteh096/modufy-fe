"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BackToAppLinkProps = {
  className?: string;
  /** Compact label for narrow headers */
  compact?: boolean;
};

/** Returns to the main dashboard shell (sidebar + modules). */
export function BackToAppLink({ className, compact }: BackToAppLinkProps) {
  return (
    <Button
      nativeButton={false}
      render={<Link href="/dashboard" />}
      variant="outline"
      size="sm"
      className={cn("gap-1.5 shrink-0", className)}
    >
      <ArrowLeft className="h-4 w-4" />
      <LayoutDashboard className="h-4 w-4 opacity-70" />
      <span>{compact ? "App" : "Main app"}</span>
    </Button>
  );
}
