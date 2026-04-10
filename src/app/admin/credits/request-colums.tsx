import Button from "@/components/common/Button";
import { CreditHistory } from "@/lib/api/credit";
import { ColumnDef } from "@tanstack/react-table";

interface RequestColumnsHandlers {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const createRequestColumns = (
  handlers: RequestColumnsHandlers,
): ColumnDef<CreditHistory>[] => [
  {
    accessorKey: "workplaceName",
    header: "사업장",
    cell: ({ row }) => (
      <div className="font-medium text-text">
        {row.original.workplaceName || "-"}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "요청 수량",
    cell: ({ row }) => (
      <div className="text-sm text-text-2 font-mono">
        {row.original.amount.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "createdBy",
    header: "요청자",
    cell: ({ row }) => (
      <div className="text-sm text-text-2">{row.original.createdBy}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "요청일시",
    cell: ({ row }) => (
      <div className="text-sm text-text-3 font-mono">
        {row.original.createdAt}
      </div>
    ),
  },
  {
    id: "actions",
    header: "관리",
    cell: ({ row }) => (
      <div className="flex gap-1.5">
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
          onClick={() => handlers.onReject(row.original.id)}
        />
      </div>
    ),
  },
];
