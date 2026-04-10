"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { Workplace } from "@/types/workplace";

export const workplaceColumns: ColumnDef<Workplace>[] = [
  {
    accessorKey: "name",
    header: "사업장명",
    cell: ({ row }) => (
      <span className="font-medium text-text">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "issueCode",
    header: "라이센스",
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-xs  border border-border-2 px-2 py-0.5 rounded text-accent">
        {row.original.issueCode}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const statusConfig = {
        active: {
          label: "운영중",
          color: "green",
          bgColor: "bg-green-dim",
          textColor: "text-green",
          dotColor: "bg-green",
        },
        pending: {
          label: "대기중",
          color: "amber",
          bgColor: "bg-amber-dim",
          textColor: "text-amber",
          dotColor: "bg-amber",
        },
        inactive: {
          label: "비활성",
          color: "gray",
          bgColor: "bg-gray-200",
          textColor: "text-text-3",
          dotColor: "bg-text-3",
        },
      };

      const config = statusConfig[row.original.status];

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded ${config.bgColor} ${config.textColor} text-[11px] font-medium font-mono`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}
          ></span>
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "credit",
    header: "크레딧",
    cell: ({ row }) => {
      const remaining = row.original.creditRemaining;
      const total = row.original.creditTotal;
      const percentage = Math.round((remaining / total) * 100);

      let barColor = "bg-accent";
      if (percentage <= 20) barColor = "bg-red";
      else if (percentage <= 50) barColor = "bg-amber";

      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 max-w-[80px] h-1 bg-border rounded-sm overflow-hidden">
            <div
              className={`h-full rounded-sm transition-all duration-300 ${barColor}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="font-mono text-xs text-text-2 min-w-[48px]">
            {remaining}
            <span className="text-text-3">/{total}</span>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "cardCount",
    header: "카드수",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-2">
        {row.original.cardCount}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "생성일",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-3">
        {row.original.createdAt}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-1.5">
        <button
          className="w-7 h-7 rounded-md border border-border-2 bg-transparent text-text-3 hover:text-text hover:border-accent hover:bg-accent-dim transition-all duration-150 flex items-center justify-center"
          title="상세"
          onClick={() => {
            // TODO: 상세 페이지로 이동
            console.log("View:", row.original.id);
          }}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button
          className="w-7 h-7 rounded-md border border-border-2 bg-transparent text-text-3 hover:text-text hover:border-accent hover:bg-accent-dim transition-all duration-150 flex items-center justify-center"
          title="편집"
          onClick={() => {
            // TODO: 편집 모달 열기
            console.log("Edit:", row.original.id);
          }}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
  },
];
