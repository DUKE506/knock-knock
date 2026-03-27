"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { BaseTableProps } from "@/types/table/table";

export default function BaseTable<TData>({
  data,
  columns,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  pageSize = 10,
  searchPlaceholder = "검색...",
  emptyMessage = "데이터가 없습니다.",
  serverSide,
}: BaseTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // 서버 사이드 모드: 검색어 변경 시 핸들러 호출
  useEffect(() => {
    if (serverSide?.onSearch) {
      const timer = setTimeout(() => {
        serverSide.onSearch!(globalFilter);
      }, 300); // 디바운스 300ms

      return () => clearTimeout(timer);
    }
  }, [globalFilter, serverSide]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      !serverSide && enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      !serverSide && enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel:
      !serverSide && enablePagination ? getPaginationRowModel() : undefined,
    manualPagination: !!serverSide, // 서버 사이드면 수동 페이지네이션
    manualFiltering: !!serverSide, // 서버 사이드면 수동 필터링
    manualSorting: !!serverSide, // 서버 사이드면 수동 정렬
    pageCount: serverSide ? serverSide.totalPages : undefined,
    initialState: {
      pagination: {
        pageSize: serverSide ? serverSide.pageSize : pageSize,
        pageIndex: serverSide ? serverSide.currentPage - 1 : 0,
      },
    },
  });

  // 서버 사이드 페이지 변경
  const handlePageChange = (newPage: number) => {
    if (serverSide) {
      serverSide.onPageChange(newPage + 1); // 서버는 1부터, tanstack은 0부터
    } else {
      table.setPageIndex(newPage);
    }
  };

  // 현재 페이지 인덱스
  const currentPageIndex = serverSide
    ? serverSide.currentPage - 1
    : table.getState().pagination.pageIndex;

  // 전체 페이지 수
  const totalPages = serverSide ? serverSide.totalPages : table.getPageCount();

  // 전체 데이터 수
  const totalCount = serverSide
    ? serverSide.totalCount
    : table.getFilteredRowModel().rows.length;

  // 현재 페이지의 시작/끝 번호
  const pageStart = serverSide
    ? (serverSide.currentPage - 1) * serverSide.pageSize + 1
    : currentPageIndex * table.getState().pagination.pageSize + 1;

  const pageEnd = serverSide
    ? Math.min(
        serverSide.currentPage * serverSide.pageSize,
        serverSide.totalCount,
      )
    : Math.min(
        (currentPageIndex + 1) * table.getState().pagination.pageSize,
        totalCount,
      );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      {enableFiltering && (
        <div>
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full max-w-sm px-3 py-2 bg-surface text-sm border border-border-2 rounded-md outline-none focus:border-accent transition-colors"
            disabled={serverSide?.isLoading}
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-accent">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-[11px] text-white font-mono tracking-wide uppercase"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center gap-2"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {enableSorting && header.column.getCanSort() && (
                          <span className="text-white/60">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "↕"}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {serverSide?.isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-text-3"
                >
                  로딩 중...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-text-3"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-b-0 hover:bg-accent-dim transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3.5 text-[13px] text-text"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-text-3">
            {totalCount}개 중 {pageStart}-{pageEnd}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPageIndex === 0 || serverSide?.isLoading}
              className="p-2 border border-border-2 rounded-md hover:bg-accent-dim hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4 text-text-2" />
            </button>
            <button
              onClick={() => handlePageChange(currentPageIndex - 1)}
              disabled={currentPageIndex === 0 || serverSide?.isLoading}
              className="p-2 border border-border-2 rounded-md hover:bg-accent-dim hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-text-2" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i).map(
                (pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => handlePageChange(pageIndex)}
                    disabled={serverSide?.isLoading}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPageIndex === pageIndex
                        ? "bg-accent text-white"
                        : "border border-border-2 text-text-2 hover:bg-accent-dim hover:border-accent"
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPageIndex + 1)}
              disabled={
                currentPageIndex >= totalPages - 1 || serverSide?.isLoading
              }
              className="p-2 border border-border-2 rounded-md hover:bg-accent-dim hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-text-2" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={
                currentPageIndex >= totalPages - 1 || serverSide?.isLoading
              }
              className="p-2 border border-border-2 rounded-md hover:bg-accent-dim hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4 text-text-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
