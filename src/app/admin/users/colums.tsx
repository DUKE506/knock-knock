import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Mail } from "lucide-react";

export interface Admin {
  id: string;
  loginId: string;
  name: string;
  deptName: string;
  job: string;
  role: string;
  createdAt: string;
}

// 테이블 컬럼 정의
export const columns: ColumnDef<Admin>[] = [
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
    accessorKey: "loginId",
    header: "아이디",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm text-text-2">
        <Mail className="w-3.5 h-3.5" />
        {row.original.loginId}
      </div>
    ),
  },
  {
    accessorKey: "deptName",
    header: "부서",
    cell: ({ row }) => (
      <span className="text-sm text-text-2">{row.original.deptName}</span>
    ),
  },
  {
    accessorKey: "job",
    header: "직책",
    cell: ({ row }) => (
      <span className="text-sm text-text-2">{row.original.job}</span>
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
