import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Workplace } from "@/types/workplace";
import { fetchWorkplaces } from "@/lib/api/workplace";
import { PagedRequest } from "@/types/pagination";
import { PaginationMeta } from "@/types/response";

interface WorkplaceStore {
  workplaces: Workplace[];
  meta: PaginationMeta;
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
  fetchWorkplaces: (params: PagedRequest) => Promise<void>;
}

export const useWorkplaceStore = create<WorkplaceStore>()(
  persist(
    (set) => ({
      workplaces: [],
      meta: {
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },
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

      // 백엔드에서 데이터 가져오기 (페이지네이션 지원)
      fetchWorkplaces: async (params) => {
        set({ isLoading: true, error: null });

        try {
          const result = await fetchWorkplaces(params);

          if (result.error || !result.data) {
            set({
              error: result.error || "데이터 로딩 실패",
              isLoading: false,
            });
            return;
          }

          set({
            workplaces: result.data.data,
            meta: result.data.meta,
            isLoading: false,
          });
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
