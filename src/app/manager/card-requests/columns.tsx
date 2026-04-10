import Button from "@/components/common/Button";
import { CardRequest } from "@/types/manager/card/cardRequest";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock } from "lucide-react";

interface ColumnsHandlers {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDetail: (request: CardRequest) => void;
}

export const createCardRequestColumns = (
  handlers: ColumnsHandlers,
): ColumnDef<CardRequest>[] => [
  {
    accessorKey: "userName",
    header: "이름",
    cell: ({ row }) => (
      <div className="font-medium text-text">{row.original.userName}</div>
    ),
  },
  {
    accessorKey: "userEmail",
    header: "이메일",
    cell: ({ row }) => (
      <div className="text-sm text-text-2">{row.original.userEmail}</div>
    ),
  },
  {
    accessorKey: "userPhone",
    header: "전화번호",
    cell: ({ row }) => (
      <div className="text-sm text-text-2 font-mono">
        {row.original.userPhone}
      </div>
    ),
  },
  {
    accessorKey: "requestedAt",
    header: "요청일시",
    cell: ({ row }) => (
      <div className="text-sm text-text-3 font-mono">
        {row.original.requestedAt}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const statusConfig = {
        pending: {
          label: "대기중",
          color: "bg-amber-dim text-amber",
          icon: Clock,
        },
        approved: {
          label: "승인",
          color: "bg-green-dim text-green",
          icon: CheckCircle,
        },
      };

      const config = statusConfig[row.original.status] ?? statusConfig.pending;
      const Icon = config.icon;
      const { isActivated } = row.original;

      return (
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${config.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
          {row.original.status === "approved" && isActivated !== undefined && (
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                isActivated
                  ? "bg-green-dim text-green"
                  : "bg-amber-dim text-amber"
              }`}
            >
              {isActivated ? "활성화됨" : "미활성화"}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "관리",
    cell: ({ row }) => {
      const isPending = row.original.status === "pending";
      const isApproved = row.original.status === "approved";

      return (
        <div className="flex gap-1.5">
          {isPending ? (
            <>
              <Button
                variant="primary"
                size="sm"
                title="승인"
                onClick={() => handlers.onApprove(row.original.id)}
              />
              <Button
                variant="danger"
                size="sm"
                title="거부"
                onClick={() => {
                  if (confirm("정말 거부하시겠습니까?")) {
                    handlers.onReject(row.original.id);
                  }
                }}
              />
            </>
          ) : isApproved ? (
            <Button
              variant="secondary"
              size="sm"
              title="상세"
              onClick={() => handlers.onDetail(row.original)}
            />
          ) : null}
        </div>
      );
    },
  },
];
