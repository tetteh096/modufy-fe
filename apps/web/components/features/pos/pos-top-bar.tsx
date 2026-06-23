"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, Lock, Store } from "lucide-react";
import { useLockStore } from "@/store/lock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PosTopBarProps = {
  className?: string;
};

export function PosTopBar({ className }: PosTopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lock = useLockStore((s) => s.lock);
  const onPosHome = pathname === "/pos";

  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between border-b bg-background px-4 py-3 md:px-6",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Store className="h-5 w-5 shrink-0 text-primary" />
        {onPosHome ? (
          <span className="font-semibold truncate">Point of Sale</span>
        ) : (
          <Button
            nativeButton={false}
            render={<Link href="/pos" />}
            variant="ghost"
            size="sm"
            className="gap-1.5 px-2 font-semibold"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">POS home</span>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            lock(pathname);
            router.push("/lock-screen");
          }}
        >
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Lock</span>
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/dashboard" />}
          variant="ghost"
          size="sm"
          className="gap-1.5"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>
      </div>
    </header>
  );
}
