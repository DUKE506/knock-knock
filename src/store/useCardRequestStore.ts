import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchCardRequests } from "@/lib/api/cardRequest";
import { CardRequest } from "@/types/manager/card/Cardruquest";

interface CardRequestStore {
  cardRequests: CardRequest[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCardRequests: (cardRequests: CardRequest[]) => void;
  addCardRequest: (cardRequest: CardRequest) => void;
  updateCardRequest: (id: string, updates: Partial<CardRequest>) => void;
  deleteCardRequest: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Supabase 동기화
  syncWithSupabase: (workplaceId: string) => Promise<void>;
}

export const useCardRequestStore = create<CardRequestStore>()(
  persist(
    (set) => ({
      cardRequests: [],
      isLoading: false,
      error: null,

      setCardRequests: (cardRequests) => set({ cardRequests }),

      addCardRequest: (cardRequest) =>
        set((state) => ({
          cardRequests: [cardRequest, ...state.cardRequests],
        })),

      updateCardRequest: (id, updates) =>
        set((state) => ({
          cardRequests: state.cardRequests.map((req) =>
            req.id === id ? { ...req, ...updates } : req,
          ),
        })),

      deleteCardRequest: (id) =>
        set((state) => ({
          cardRequests: state.cardRequests.filter((req) => req.id !== id),
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Supabase에서 데이터 가져오기
      syncWithSupabase: async (workplaceId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { cardRequests, error } = await fetchCardRequests(workplaceId);
          if (error) {
            set({
              error: "카드 요청 목록을 불러오는데 실패했습니다.",
              isLoading: false,
            });
          } else {
            set({ cardRequests, isLoading: false });
          }
        } catch (err) {
          set({ error: "데이터 동기화 실패", isLoading: false });
        }
      },
    }),
    {
      name: "card-request-storage", // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
