import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

export type BranchOption = {
  id: string;
  name: string;
  is_default?: boolean;
};

interface AuthState {
  token: string | null;
  user: User | null;
  businessId: string | null;
  activeBranchId: string | null;
  activeBranchName: string | null;
  branches: BranchOption[];
  isAuthenticated: boolean;
  setAuth: (
    token: string,
    user: User,
    businessId: string,
    branch?: { id: string; name: string },
    branches?: BranchOption[],
  ) => void;
  setBranch: (token: string, branch: { id: string; name: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      businessId: null,
      activeBranchId: null,
      activeBranchName: null,
      branches: [],
      isAuthenticated: false,
      setAuth: (token, user, businessId, branch, branches = []) =>
        set({
          token,
          user,
          businessId,
          activeBranchId: branch?.id ?? null,
          activeBranchName: branch?.name ?? null,
          branches,
          isAuthenticated: true,
        }),
      setBranch: (token, branch) =>
        set({
          token,
          activeBranchId: branch.id,
          activeBranchName: branch.name,
        }),
      clearAuth: () =>
        set({
          token: null,
          user: null,
          businessId: null,
          activeBranchId: null,
          activeBranchName: null,
          branches: [],
          isAuthenticated: false,
        }),
    }),
    { name: "Modufy-auth" },
  ),
);
