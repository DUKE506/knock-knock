import { ManagerCreditHistoryItem } from "@/lib/api/credit";
import { ColumnDef } from "@tanstack/react-table";
import { Zap, Minus } from "lucide-react";

export const creditHistoryColumns: ColumnDef<ManagerCreditHistoryItem>[] = [
  {
    accessorKey: "gubun",
    header: "구분",
    cell: ({ row }) => {
      const gubun = row.original.gubun;
      const isCharge = gubun === "충전";
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
            isCharge ? "bg-green-dim text-green" : "bg-red-dim text-red"
          }`}
        >
          {isCharge ? (
            <Zap className="w-3.5 h-3.5" />
          ) : (
            <Minus className="w-3.5 h-3.5" />
          )}
          {gubun}
        </span>
      );
    },
  },
  {
    accessorKey: "creditCount",
    header: "수량",
    cell: ({ row }) => {
      const isCharge = row.original.gubun === "충전";
      return (
        <div className={`text-sm font-mono ${isCharge ? "text-green" : "text-red"}`}>
          {isCharge ? "+" : "-"}
          {row.original.creditCount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "producer",
    header: "처리자",
    cell: ({ row }) => {
      const { gubun, producer, consumer } = row.original;
      const actor = gubun === "충전" ? producer : (consumer ?? producer);
      return <div className="text-sm text-text-2">{actor || "-"}</div>;
    },
  },
  {
    accessorKey: "createDt",
    header: "일시",
    cell: ({ row }) => (
      <div className="text-sm text-text-3 font-mono">{row.original.createDt}</div>
    ),
  },
];
