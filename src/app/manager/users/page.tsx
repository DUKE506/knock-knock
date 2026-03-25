"use client";

import { useState } from "react";
import { UserCheck, Mail, Phone, Calendar } from "lucide-react";
import BaseTable from "@/components/common/table/BaseTable";
import { ColumnDef } from "@tanstack/react-table";

// 임시 더미 데이터
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "김철수",
    email: "kim@example.com",
    phone: "010-1234-5678",

    createdAt: "2025.03.15",
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@example.com",
    phone: "010-2345-6789",

    createdAt: "2025.03.10",
  },
  {
    id: "3",
    name: "박민수",
    email: "park@example.com",
    phone: "010-3456-7890",

    createdAt: "2025.03.05",
  },
  {
    id: "4",
    name: "최동현",
    email: "choi@example.com",
    phone: "010-4567-8901",

    createdAt: "2025.03.01",
  },
  {
    id: "5",
    name: "정수진",
    email: "jung@example.com",
    phone: "010-5678-9012",

    createdAt: "2025.02.28",
  },
];

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);

  // 테이블 컬럼 정의
  const columns: ColumnDef<User>[] = [
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
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">담당자 관리</h1>
          <p className="text-sm text-text-3 mt-1">전체 {users.length}명</p>
        </div>
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
      />
    </>
  );
}
