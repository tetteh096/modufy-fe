"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/shared/spinner";
import { useLockStore } from "@/store/lock";

/** Redirects to lock screen when the session is marked locked. */
export function LockScreenGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLocked = useLockStore((s) => s.isLocked);

  useEffect(() => {
    if (isLocked) router.replace("/lock-screen");
  }, [isLocked, router]);

  if (isLocked) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return children;
}
