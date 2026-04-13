"use client";

import { useEffect, useState } from "react";
import { UserCheck, Mail, Phone, Calendar, Plus, Shield } from "lucide-react";
import BaseTable from "@/components/common/table/BaseTable";
import Button from "@/components/common/Button";
import BaseModal from "@/components/common/modal/BaseModal";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Admin, columns } from "./colums";
import InviteUserModal from "@/components/admin/users/InviteUserModal";
import { useAdminStore } from "@/store/useAdminStore";
import { useQueryParams } from "@/hooks/useQueryParams";

// const mockAdmins: Admin[] = [
//   {
//     id: "1",
//     name: "김관리",
//     email: "admin1@example.com",
//     phone: "010-1111-2222",
//     role: "super_admin",
//     createdAt: "2025.01.15",
//   },
//   {
//     id: "2",
//     name: "이관리",
//     email: "admin2@example.com",
//     phone: "010-2222-3333",
//     role: "admin",
//     createdAt: "2025.02.10",
//   },
//   {
//     id: "3",
//     name: "박관리",
//     email: "admin3@example.com",
//     phone: "010-3333-4444",
//     role: "admin",
//     createdAt: "2025.03.05",
//   },
// ];

export default function AdminsPage() {
  // const [admins] = useState<Admin[]>(mockAdmins);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { admins, meta, getAdmins } = useAdminStore();
  const { page, search, params, setPage, setSearch } = useQueryParams();

  useEffect(() => {
    getAdmins(params);
  }, [page, search]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">관리자</h1>
          <p className="text-sm text-text-3 mt-1">
            전체 {admins.length}명 • 슈퍼관리자{" "}
            {admins.filter((a) => a.role === "super_admin").length}명 • 관리자{" "}
            {admins.filter((a) => a.role === "admin").length}명
          </p>
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
        data={admins}
        columns={columns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
        searchPlaceholder="이름, 이메일, 전화번호 검색..."
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

      {/* 관리자 추가 모달 */}
      <InviteUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
