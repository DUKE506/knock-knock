"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import BaseTable from "@/components/common/table/BaseTable";
import InviteUserModal from "@/components/manager/users/InviteUserModal";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import Button from "@/components/common/Button";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useClientStore } from "@/store/useClientStore";
import { useAuthStore } from "@/store/useAuthStore";
import { delegatePrimaryRole, User } from "@/lib/api/user";
import { createColumns } from "./columns";

export default function UsersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [delegateTarget, setDelegateTarget] = useState<User | null>(null);
  const [isDelegating, setIsDelegating] = useState(false);

  const { users, meta, getUsers } = useClientStore();
  const { page, search, params, setPage, setSearch } = useQueryParams();
  const { user, setUser } = useAuthStore();

  const isMainMaster = user?.role === "MainMaster";

  useEffect(() => {
    getUsers(params);
  }, [page, search]);

  const handleDelegate = async () => {
    if (!delegateTarget) return;
    setIsDelegating(true);

    const result = await delegatePrimaryRole(delegateTarget.id);
    setIsDelegating(false);

    if (!result.success) {
      toast.error("위임에 실패했습니다.");
      return;
    }

    toast.success(`${delegateTarget.name}님에게 주관리자 권한이 위임되었습니다.`);
    setDelegateTarget(null);

    if (user) setUser({ ...user, role: "SubMaster" });
    getUsers(params);
  };

  const columns = createColumns(user?.role ?? "", setDelegateTarget);

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">관리자</h1>
          <p className="text-sm text-text-3 mt-1">전체 {meta.totalCount}명</p>
        </div>

        {isMainMaster && (
          <Button
            variant="primary"
            size="md"
            title="관리자 초대"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      {/* Table */}
      <BaseTable
        data={users}
        columns={columns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
        searchPlaceholder="이름, 아이디 검색..."
        emptyMessage="등록된 관리자가 없습니다."
        serverSide={{
          totalCount: meta.totalCount,
          totalPages: meta.totalPages,
          currentPage: meta.pageNumber,
          pageSize: meta.pageSize,
          currentSearch: search,
          onPageChange: setPage,
          onSearch: setSearch,
        }}
      />

      <InviteUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ConfirmModal
        isOpen={delegateTarget !== null}
        onClose={() => setDelegateTarget(null)}
        onConfirm={handleDelegate}
        title="주관리자 위임"
        description={`${delegateTarget?.name}님에게 주관리자 권한을 위임하시겠습니까?\n위임 후 본인은 부관리자로 변경됩니다.`}
        confirmText="위임하기"
        icon={ArrowRightLeft}
        isLoading={isDelegating}
      />
    </>
  );
}
