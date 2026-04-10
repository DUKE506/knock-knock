import { User } from "@/lib/api/user";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Mail, Phone } from "lucide-react";

// 임시 더미 데이터
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   createdAt: string;
// }

// 테이블 컬럼 정의
export const columns: ColumnDef<User>[] = [
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
