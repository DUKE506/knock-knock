"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import BaseTable from "@/components/common/table/BaseTable";
import CardDetailModal from "@/components/manager/cards/CardDetailModal";
import {
  CardRequest,
  CardRequestStatus,
} from "@/types/manager/card/cardRequest";
import { approveCardRequest, rejectCardRequest } from "@/lib/api/cardRequest";
import { useCardRequestStore } from "@/store/useCardRequestStore";
import { useQueryParams } from "@/hooks/useQueryParams";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { XCircle } from "lucide-react";
import { createCardRequestColumns } from "./columns";

export default function CardRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    CardRequestStatus | "all"
  >("all");
  const [selectedRequest, setSelectedRequest] = useState<CardRequest | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const {
    cardRequests,
    meta,
    getCardRequests,
    updateCardRequest,
    deleteCardRequest,
  } = useCardRequestStore();
  const { page, search, params, setPage, setSearch } = useQueryParams();

  // 카드 요청 목록 불러오기
  useEffect(() => {
    getCardRequests(params);
  }, [page, search]);

  // 상세 모달 열기
  const openDetailModal = (cardRequest: CardRequest) => {
    setSelectedRequest(cardRequest);
    setIsDetailModalOpen(true);
  };

  // 승인 처리
  const handleApprove = async (id: string) => {
    const { error } = await approveCardRequest(id);
    if (error) {
      toast.error("승인 처리에 실패했습니다.");
    } else {
      toast.success("카드 발급이 승인되었습니다.");
      updateCardRequest(id, { status: "approved" });
    }
  };

  // 거부 처리
  const handleReject = async () => {
    if (!rejectTargetId) return;
    setIsRejecting(true);
    const { error } = await rejectCardRequest(rejectTargetId);
    setIsRejecting(false);
    if (error) {
      toast.error("거부 처리에 실패했습니다.");
    } else {
      toast.success("카드 발급 요청이 거부되었습니다.");
      deleteCardRequest(rejectTargetId);
      setRejectTargetId(null);
    }
  };

  // 상태별 필터링
  const filteredRequests =
    selectedStatus === "all"
      ? cardRequests
      : cardRequests.filter((req) => req.status === selectedStatus);

  // 통계
  const stats = {
    pending: cardRequests.filter((req) => req.status === "pending").length,
    approved: cardRequests.filter((req) => req.status === "approved").length,
  };

  const columns = createCardRequestColumns({
    onApprove: handleApprove,
    onReject: setRejectTargetId,
    onDetail: openDetailModal,
  });

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">카드 발급 관리</h1>
          <p className="text-sm text-text-3 mt-1">
            전체 {meta.totalCount}개 • 대기중 {stats.pending}개 • 승인{" "}
            {stats.approved}개
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1 mb-4">
        {[
          { value: "all", label: "전체", count: meta.totalCount },
          { value: "pending", label: "대기중", count: stats.pending },
          { value: "approved", label: "승인", count: stats.approved },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() =>
              setSelectedStatus(tab.value as CardRequestStatus | "all")
            }
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedStatus === tab.value
                ? "bg-accent text-white"
                : "text-text-2 hover:text-text hover:bg-bg"
            }`}
          >
            {tab.label}{" "}
            <span className="ml-1.5 text-xs opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <BaseTable
        data={filteredRequests}
        columns={columns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={params.pageSize}
        emptyMessage="카드 발급 요청이 없습니다."
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

      {/* 상세 모달 */}
      <CardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        cardRequest={selectedRequest}
      />

      {/* 거부 확인 모달 */}
      <ConfirmModal
        isOpen={rejectTargetId !== null}
        onClose={() => setRejectTargetId(null)}
        onConfirm={handleReject}
        title="발급 요청 거부"
        description={"정말 거부하시겠습니까?\n거부 시 해당 요청은 삭제됩니다."}
        confirmText="거부"
        variant="danger"
        icon={XCircle}
        isLoading={isRejecting}
      />
    </>
  );
}
