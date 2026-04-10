import { Admin } from "@/app/admin/users/colums";
import { fetchAdmins } from "@/lib/api/admin/admin";
import { PagedRequest } from "@/types/pagination";
import { PaginationMeta } from "@/types/response";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AdminState {
  admins: Admin[];
  meta: PaginationMeta;
  isLoading: boolean;
  error: string | null;

  //Actions

  //fetch
  getAdmins: (params: PagedRequest) => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      admins: [],
      meta: {
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },
      isLoading: false,
      error: null,
      getAdmins: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const result = await fetchAdmins(params);

          if (result.error || !result.data) {
            set({
              error: result.error?.message || "데이터 로딩 실패",
              isLoading: false,
            });
            return;
          }

          set({
            meta: result.data.meta,
            admins: result.data.data,
            isLoading: false,
          });
        } catch (err) {
          set({ error: "데이터 동기화 실패", isLoading: false });
        }
      },
    }),
    {
      name: "admin-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
