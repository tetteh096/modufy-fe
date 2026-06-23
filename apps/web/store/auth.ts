import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  businessId: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User, businessId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      businessId: null,
      isAuthenticated: false,
      setAuth: (token, user, businessId) =>
        set({ token, user, businessId, isAuthenticated: true }),
      clearAuth: () =>
        set({ token: null, user: null, businessId: null, isAuthenticated: false }),
    }),
    { name: "bizos-auth" }
  )
);
