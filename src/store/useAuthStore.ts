import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

//auth 관리용 공통 타입
export interface AuthUser {
  id: string;
  name: string;
  phone?: string | null;
  email: string;
  isAdmin: boolean;
  role: string;
  workplaceId?: string;
  workplaceName?: string;
  deptName?: string;
  job?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  //Actions
  setUser: (user: AuthUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
      },
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) },
  ),
);
