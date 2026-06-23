"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { posApi } from "@/lib/api";
import { useLockStore } from "@/store/lock";

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

/** Auto-locks POS after configured idle minutes (from POS settings). */
export function PosIdleLock() {
  const router = useRouter();
  const pathname = usePathname();
  const lock = useLockStore((s) => s.lock);
  const isLocked = useLockStore((s) => s.isLocked);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: settings } = useQuery({
    queryKey: ["pos-settings"],
    queryFn: posApi.getSettings,
    staleTime: 60_000,
  });

  const idleMinutes = settings?.idle_lock_minutes ?? 10;

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isLocked || idleMinutes <= 0) return;

    const ms = idleMinutes * 60_000;

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        lock(pathname);
        router.push("/lock-screen");
      }, ms);
    }

    resetTimer();
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [idleMinutes, isLocked, lock, pathname, router]);

  return null;
}
