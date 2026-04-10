import { CreditHistory } from "@/lib/api/credit";
import { ColumnDef } from "@tanstack/react-table";
import { Zap } from "lucide-react";

// 이력 테이블 컬럼
export const historyColumns: ColumnDef<CreditHistory>[] = [
  {
    accessorKey: "type",
    header: "타입",
    cell: ({ row }) => {
      const type = row.original.type;
      const config: Record<string, { label: string; color: string }> = {
        charged: { label: "충전", color: "bg-green-dim text-green" },
      };
      const c = config[type] ?? config.charged;
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${c.color}`}
        >
          <Zap className="w-3.5 h-3.5" />
          {c.label}
        </span>
      );
    },
  },
  {
    accessorKey: "workplaceName",
    header: "사업장",
    cell: ({ row }) => (
      <div className="text-sm text-text-2">
        {row.original.workplaceName || "-"}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "수량",
    cell: ({ row }) => (
      <div className="text-sm text-text font-mono">
        {row.original.amount.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "createdBy",
    header: "처리자",
    cell: ({ row }) => (
      <div className="text-sm text-text-2">
        {row.original.createdBy || "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "일시",
    cell: ({ row }) => (
      <div className="text-sm text-text-3 font-mono">
        {row.original.createdAt}
      </div>
    ),
  },
];
