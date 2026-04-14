"use client";

import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import BaseTable from "@/components/common/table/BaseTable";
import CreateWorkplaceModal from "@/components/admin/workplaces/CreateWorkplaceModal";
import { workplaceColumns } from "./columns";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { Workplace } from "@/types/workplace";
import Button from "@/components/common/Button";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function WorkplacesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { workplaces, meta, fetchWorkplaces, setWorkplaces } =
    useWorkplaceStore();
  const { page, search, params, setPage, setSearch } = useQueryParams();

  // 초기 데이터 로드 (임시)
  useEffect(() => {
    fetchWorkplaces(params);
  }, [page, search]);

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">고객사 관리</h1>
          <p className="text-sm text-text-3 mt-1">
            전체 {workplaces.length}개 고객사
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Plus}
            title="고객사 생성"
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>

      {/* Table */}
      <BaseTable
        data={workplaces}
        columns={workplaceColumns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
        searchPlaceholder="고객사명, 라이센스 검색..."
        emptyMessage="등록된 고객사가 없습니다."
        serverSide={{
          totalCount: meta.totalCount,
          totalPages: meta.totalPages,
          currentPage: meta.pageNumber,
          pageSize: meta.pageSize,
          currentSearch: search,
          onPageChange: setPage,
          onSearch: setSearch,
        }}
      />

      {/* Create Modal */}
      <CreateWorkplaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
