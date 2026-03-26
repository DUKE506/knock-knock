"use client";

import { useState } from "react";
import { UserCheck, Mail, Phone, Calendar, Plus, Shield } from "lucide-react";
import BaseTable from "@/components/common/table/BaseTable";
import Button from "@/components/common/Button";
import BaseModal from "@/components/common/modal/BaseModal";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

// 임시 더미 데이터
interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

const mockAdmins: Admin[] = [
  {
    id: "1",
    name: "김관리",
    email: "admin1@example.com",
    phone: "010-1111-2222",
    role: "super_admin",
    createdAt: "2025.01.15",
  },
  {
    id: "2",
    name: "이관리",
    email: "admin2@example.com",
    phone: "010-2222-3333",
    role: "admin",
    createdAt: "2025.02.10",
  },
  {
    id: "3",
    name: "박관리",
    email: "admin3@example.com",
    phone: "010-3333-4444",
    role: "admin",
    createdAt: "2025.03.05",
  },
];

export default function AdminsPage() {
  const [admins] = useState<Admin[]>(mockAdmins);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 추가 폼
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
  });

  // 관리자 추가
  const handleAddAdmin = async () => {
    if (!addForm.name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    if (!addForm.email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    if (!addForm.phone.trim()) {
      toast.error("전화번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    // TODO: API 호출
    setTimeout(() => {
      toast.success("관리자가 추가되었습니다.");
      setAddForm({ name: "", email: "", phone: "", role: "admin" });
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  // 테이블 컬럼 정의
  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "name",
      header: "이름",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-dim flex items-center justify-center">
            <span className="text-accent font-semibold text-xs">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <span className="font-medium text-text">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "이메일",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-text-2">
          <Mail className="w-3.5 h-3.5" />
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "전화번호",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-text-2">
          <Phone className="w-3.5 h-3.5" />
          <span className="font-mono">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "가입일",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-text-3">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-mono">{row.original.createdAt}</span>
        </div>
      ),
    },
  ];

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
          title="관리자 추가"
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
      />

      {/* 관리자 추가 모달 */}
      <BaseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddForm({ name: "", email: "", phone: "", role: "admin" });
        }}
        title="관리자 추가"
        onSubmit={handleAddAdmin}
        submitText="추가하기"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-3">새로운 관리자를 추가합니다</p>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              이름 <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              placeholder="홍길동"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              이메일 <span className="text-red">*</span>
            </label>
            <input
              type="email"
              value={addForm.email}
              onChange={(e) =>
                setAddForm({ ...addForm, email: e.target.value })
              }
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              전화번호 <span className="text-red">*</span>
            </label>
            <input
              type="tel"
              value={addForm.phone}
              onChange={(e) =>
                setAddForm({ ...addForm, phone: e.target.value })
              }
              placeholder="010-1234-5678"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
