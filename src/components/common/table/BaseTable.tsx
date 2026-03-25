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
import { useState } from "react";
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
}: BaseTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

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
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

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
            {table.getRowModel().rows.length === 0 ? (
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
                  className="border-b border-border last:border-b-0 hover:bg-surface-2 transition-colors"
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
      {enablePagination && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-text-3">
            {table.getFilteredRowModel().rows.length}개 중{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-border-2 rounded-md hover:bg-accent-dim hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4 text-text-2" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-border-2 rounded-md hover:bg-accent-dim hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-text-2" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
                (pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      table.getState().pagination.pageIndex === pageIndex
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
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-border-2 rounded-md hover:bg-accent-dim hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-text-2" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
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
