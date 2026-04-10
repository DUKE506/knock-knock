"use client";

import { useEffect, useState } from "react";
import { UserCheck, Mail, Phone, Calendar, Plus } from "lucide-react";
import BaseTable from "@/components/common/table/BaseTable";

import InviteUserModal from "@/components/manager/users/InviteUserModal";
import Button from "@/components/common/Button";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useClientStore } from "@/store/useClientStore";
import { columns } from "./columns";

// const mockUsers: User[] = [
//   {
//     id: "1",
//     name: "김철수",
//     email: "kim@example.com",
//     phone: "010-1234-5678",

//     createdAt: "2025.03.15",
//   },
//   {
//     id: "2",
//     name: "이영희",
//     email: "lee@example.com",
//     phone: "010-2345-6789",

//     createdAt: "2025.03.10",
//   },
//   {
//     id: "3",
//     name: "박민수",
//     email: "park@example.com",
//     phone: "010-3456-7890",

//     createdAt: "2025.03.05",
//   },
//   {
//     id: "4",
//     name: "최동현",
//     email: "choi@example.com",
//     phone: "010-4567-8901",

//     createdAt: "2025.03.01",
//   },
//   {
//     id: "5",
//     name: "정수진",
//     email: "jung@example.com",
//     phone: "010-5678-9012",

//     createdAt: "2025.02.28",
//   },
// ];

export default function UsersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [users] = useState<User[]>(mockUsers);
  const { users, meta, getUsers } = useClientStore();
  const { page, search, params, setPage, setSearch } = useQueryParams();

  useEffect(() => {
    getUsers(params);
  }, [page, search]);

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">관리자</h1>
          <p className="text-sm text-text-3 mt-1">전체 {users.length}명</p>
        </div>

        <Button
          variant="primary"
          size="md"
          title="관리자 초대"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Table */}
      <BaseTable
        data={users}
        columns={columns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
        searchPlaceholder="이름, 이메일, 전화번호 검색..."
        emptyMessage="등록된 담당자가 없습니다."
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
    </>
  );
}
