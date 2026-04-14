import { User } from "@/lib/api/user";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "loginId",
    header: "아이디",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-text-2">{row.original.loginId}</span>
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
    accessorKey: "role",
    header: "역할",
    cell: ({ row }) => {
      const isMain = row.original.role === 0;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
            isMain ? "bg-green-dim text-green" : "bg-amber-dim text-amber"
          }`}
        >
          {isMain ? "주관리자" : "부관리자"}
        </span>
      );
    },
  },
];
