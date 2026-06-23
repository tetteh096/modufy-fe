import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ImpersonationState {
  active: boolean;
  sessionId: string | null;
  scope: string | null;
  setSession: (sessionId: string, scope: string) => void;
  clearSession: () => void;
}

export const useImpersonationStore = create<ImpersonationState>()(
  persist(
    (set) => ({
      active: false,
      sessionId: null,
      scope: null,
      setSession: (sessionId, scope) =>
        set({ active: true, sessionId, scope }),
      clearSession: () =>
        set({ active: false, sessionId: null, scope: null }),
    }),
    { name: "bizos-impersonation" }
  )
);
