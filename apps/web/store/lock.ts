import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LockState {
  isLocked: boolean;
  /** Where to return after unlock (e.g. /pos/register). */
  returnPath: string | null;
  /** SHA-256 hex of lock PIN — stored locally on this device only */
  pinHash: string | null;
  lock: (returnPath?: string) => void;
  unlock: () => void;
  setPinHash: (hash: string | null) => void;
}

export const useLockStore = create<LockState>()(
  persist(
    (set) => ({
      isLocked: false,
      returnPath: null,
      pinHash: null,
      lock: (returnPath) =>
        set({
          isLocked: true,
          returnPath: returnPath?.trim() ? returnPath : null,
        }),
      unlock: () => set({ isLocked: false, returnPath: null }),
      setPinHash: (pinHash) => set({ pinHash }),
    }),
    { name: "bizos-lock" }
  )
);
