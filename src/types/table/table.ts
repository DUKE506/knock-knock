import { ColumnDef } from "@tanstack/react-table";

export interface BaseTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
