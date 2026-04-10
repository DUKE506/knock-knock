import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CreditHistory } from "@/lib/api/credit";
import { fetchCreditHistory } from "@/lib/api/credit";
import { PagedRequest } from "@/types/pagination";
import { PaginationMeta } from "@/types/response";

interface CreditHistoryStore {
  creditHistory: CreditHistory[];
  meta: PaginationMeta;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCreditHistory: (creditHistory: CreditHistory[]) => void;
  addCreditHistory: (creditHistory: CreditHistory) => void;
  updateCreditHistory: (id: string, updates: Partial<CreditHistory>) => void;
  deleteCreditHistory: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Supabase 동기화
  fetchCredits: (
    params: PagedRequest,
    filters?: {
      type?: "issued" | "requested";
      status?: "pending" | "approved" | "rejected";
      workplaceId?: string;
    },
  ) => Promise<void>;
}

export const useCreditHistoryStore = create<CreditHistoryStore>()(
  persist(
    (set) => ({
      creditHistory: [],
      meta: {
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },
      isLoading: false,
      error: null,

      setCreditHistory: (creditHistory) => set({ creditHistory }),

      addCreditHistory: (creditHistory) =>
        set((state) => ({
          creditHistory: [creditHistory, ...state.creditHistory],
        })),

      updateCreditHistory: (id, updates) =>
        set((state) => ({
          creditHistory: state.creditHistory.map((history) =>
            history.id === id ? { ...history, ...updates } : history,
          ),
        })),

      deleteCreditHistory: (id) =>
        set((state) => ({
          creditHistory: state.creditHistory.filter(
            (history) => history.id !== id,
          ),
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Supabase에서 데이터 가져오기
      fetchCredits: async (params, filters) => {
        set({ isLoading: true, error: null });
        try {
          const result = await fetchCreditHistory(params, filters);
          if (result.error || !result.data) {
            set({
              error: "크레딧 이력을 불러오는데 실패했습니다.",
              isLoading: false,
            });
            return;
          }
          set({
            creditHistory: result.data.data,
            meta: result.data.meta,
            isLoading: false,
          });
        } catch (err) {
          set({ error: "데이터 동기화 실패", isLoading: false });
        }
      },
    }),
    {
      name: "credit-history-storage", // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
