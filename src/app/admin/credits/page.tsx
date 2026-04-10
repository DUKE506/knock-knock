"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/common/Button";
import BaseTable from "@/components/common/table/BaseTable";
import { useCreditHistoryStore } from "@/store/useCreditHistoryStore";
import { useQueryParams } from "@/hooks/useQueryParams";
import { historyColumns } from "./history-colums";
import ChargeCreditModal from "@/components/admin/credits/ChargeCreditModal";

export default function AdminCreditsPage() {
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  const { creditHistory, meta, fetchCredits } = useCreditHistoryStore();
  const { page, search, params, setPage, setSearch } = useQueryParams();

  useEffect(() => {
    fetchCredits(params);
  }, [page, search]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">크레딧 관리</h1>
          <p className="text-sm text-text-3 mt-1">
            사업장별 크레딧 충전 및 이력 관리
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          title="크레딧 충전"
          icon={Plus}
          onClick={() => setIsChargeModalOpen(true)}
        />
      </div>

      {/* 이력 테이블 */}
      <BaseTable
        data={creditHistory}
        columns={historyColumns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
        searchPlaceholder="사업장 검색..."
        emptyMessage="이력이 없습니다."
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

      <ChargeCreditModal
        isOpen={isChargeModalOpen}
        onClose={() => setIsChargeModalOpen(false)}
      />
    </div>
  );
}
