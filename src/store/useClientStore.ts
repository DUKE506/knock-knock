import { fetchClientUsers, User } from "@/lib/api/user";
import { PagedRequest } from "@/types/pagination";
import { PaginationMeta } from "@/types/response";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ClientState {
  users: User[];
  meta: PaginationMeta;
  isLoading: boolean;
  error: string | null;

  //fetch
  getUsers: (params: PagedRequest) => Promise<void>;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      users: [],
      meta: {
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },
      isLoading: false,
      error: null,
      getUsers: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const result = await fetchClientUsers(params);

          if (result.error || !result.data) {
            set({ error: "로딩 실패", isLoading: false });
            return;
          }

          set({
            meta: result.data.meta,
            users: result.data.data,
            isLoading: false,
          });
        } catch (err) {
          set({ error: "데이터 동기화 실패", isLoading: false });
        }
      },
    }),
    { name: "client-storage", storage: createJSONStorage(() => localStorage) },
  ),
);
