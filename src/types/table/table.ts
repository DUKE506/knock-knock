import { ColumnDef } from "@tanstack/react-table";

export interface BaseTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];

  // 공통 옵션
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;

  // 클라이언트 사이드 전용
  pageSize?: number; // serverSide 없을 때만 사용
  // 서버 사이드
  serverSide: ServerSideTableProps;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

/**
 * BaseTable에서 사용할 서버 사이드 페이지네이션 Props
 */
export interface ServerSideTableProps {
  totalCount: number; // 전체 데이터 개수
  currentPage: number; // 현재 페이지
  pageSize: number; // 페이지당 개수
  totalPages: number; // 전체 페이지 수
  onPageChange: (page: number) => void; // 페이지 변경 핸들러
  onSearch?: (query: string) => void; // 검색 핸들러 (선택)
  onSort?: (sortBy: string, sortOrder: "asc" | "desc") => void; // 정렬 핸들러 (선택)
  isLoading?: boolean; // 로딩 상태
}
