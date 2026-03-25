import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Workplace } from "@/types/workplace";
import { fetchWorkplaces } from "@/lib/api/workplace";

interface WorkplaceStore {
  workplaces: Workplace[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setWorkplaces: (workplaces: Workplace[]) => void;
  addWorkplace: (workplace: Workplace) => void;
  updateWorkplace: (id: string, updates: Partial<Workplace>) => void;
  deleteWorkplace: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Supabase 동기화
  syncWithSupabase: () => Promise<void>;
}

export const useWorkplaceStore = create<WorkplaceStore>()(
  persist(
    (set) => ({
      workplaces: [],
      isLoading: false,
      error: null,

      setWorkplaces: (workplaces) => set({ workplaces }),

      addWorkplace: (workplace) =>
        set((state) => ({
          workplaces: [workplace, ...state.workplaces],
        })),

      updateWorkplace: (id, updates) =>
        set((state) => ({
          workplaces: state.workplaces.map((w) =>
            w.id === id ? { ...w, ...updates } : w,
          ),
        })),

      deleteWorkplace: (id) =>
        set((state) => ({
          workplaces: state.workplaces.filter((w) => w.id !== id),
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Supabase에서 데이터 가져오기
      syncWithSupabase: async () => {
        set({ isLoading: true, error: null });
        try {
          const { workplaces, error } = await fetchWorkplaces();
          if (error) {
            set({ error: error.message, isLoading: false });
          } else {
            set({ workplaces, isLoading: false });
          }
        } catch (err) {
          set({ error: "데이터 동기화 실패", isLoading: false });
        }
      },
    }),
    {
      name: "workplace-storage", // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
