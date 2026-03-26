import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CreditHistory } from "@/lib/api/credit";
import { fetchCreditHistory } from "@/lib/api/credit";

interface CreditHistoryStore {
  creditHistory: CreditHistory[];
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
  syncWithSupabase: (filters?: {
    type?: "issued" | "requested";
    status?: "pending" | "approved" | "rejected";
    workplaceId?: string;
  }) => Promise<void>;
}

export const useCreditHistoryStore = create<CreditHistoryStore>()(
  persist(
    (set) => ({
      creditHistory: [],
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
      syncWithSupabase: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const { creditHistory, error } = await fetchCreditHistory(filters);
          if (error) {
            set({
              error: "크레딧 이력을 불러오는데 실패했습니다.",
              isLoading: false,
            });
          } else {
            set({ creditHistory, isLoading: false });
          }
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
