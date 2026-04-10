import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

//auth 관리용 공통 타입
export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  isAdmin: boolean;
  role: string;
  workplaceId?: string;
  workplaceName?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;

  //Actions
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user: user });
      },
      logout: () => {
        set({ user: null });
      },
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) },
  ),
);
