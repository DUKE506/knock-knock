"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import BaseTable from "@/components/common/table/BaseTable";
import Button from "@/components/common/Button";
import {
  CardRequest,
  CardRequestStatus,
} from "@/types/manager/card/Cardruquest";
import { ColumnDef } from "@tanstack/react-table";
import { approveCardRequest, rejectCardRequest } from "@/lib/api/cardRequest";
import { useCardRequestStore } from "@/store/useCardRequestStore";

export default function CardRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    CardRequestStatus | "all"
  >("all");
  const [userName, setUserName] = useState("");
  const [workplaceId, setWorkplaceId] = useState("");

  const { cardRequests, isLoading, syncWithSupabase, updateCardRequest } =
    useCardRequestStore();

  // 사용자 정보 가져오기
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.email);
        setWorkplaceId(user.workplace_id);
      } catch (error) {
        console.error("사용자 정보 파싱 실패:", error);
      }
    }
  }, []);

  // 카드 요청 목록 불러오기 (Zustand)
  useEffect(() => {
    if (!workplaceId) return;
    syncWithSupabase(workplaceId);
  }, [workplaceId, syncWithSupabase]);

  // 승인 처리
  const handleApprove = async (id: string) => {
    if (!userName) {
      toast.error("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const { cardRequest, error } = await approveCardRequest(id, userName);

    if (error) {
      toast.error("승인 처리에 실패했습니다.");
    } else {
      toast.success("카드 발급이 승인되었습니다.");

      // Zustand 스토어 업데이트
      updateCardRequest(id, {
        status: "approved",
        reviewedBy: userName,
        reviewedAt: new Date().toLocaleString("ko-KR"),
      });
    }
  };

  // 거부 처리
  const handleReject = async (id: string, reason: string) => {
    if (!userName) {
      toast.error("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    if (!reason.trim()) {
      toast.error("거부 사유를 입력해주세요.");
      return;
    }

    const { cardRequest, error } = await rejectCardRequest(
      id,
      userName,
      reason,
    );

    if (error) {
      toast.error("거부 처리에 실패했습니다.");
    } else {
      toast.success("카드 발급이 거부되었습니다.");

      // Zustand 스토어 업데이트
      updateCardRequest(id, {
        status: "rejected",
        reviewedBy: userName,
        reviewedAt: new Date().toLocaleString("ko-KR"),
        rejectReason: reason,
      });
    }
  };

  // 상태별 필터링
  const filteredRequests =
    selectedStatus === "all"
      ? cardRequests
      : cardRequests.filter((req) => req.status === selectedStatus);

  // 통계 계산
  const stats = {
    total: cardRequests.length,
    pending: cardRequests.filter((req) => req.status === "pending").length,
    approved: cardRequests.filter((req) => req.status === "approved").length,
    rejected: cardRequests.filter((req) => req.status === "rejected").length,
  };

  // 테이블 컬럼 정의
  const columns: ColumnDef<CardRequest>[] = [
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
          rejected: {
            label: "거부",
            color: "bg-red-dim text-red",
            icon: XCircle,
          },
        };

        const config = statusConfig[row.original.status];
        const Icon = config.icon;

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${config.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "관리",
      cell: ({ row }) => {
        const isPending = row.original.status === "pending";

        return (
          <div className="flex gap-1.5">
            {isPending ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  title="승인"
                  onClick={() => handleApprove(row.original.id)}
                />
                <Button
                  variant="danger"
                  size="sm"
                  title="거부"
                  onClick={() => {
                    const reason = prompt("거부 사유를 입력하세요:");
                    if (reason) {
                      handleReject(row.original.id, reason);
                    }
                  }}
                />
              </>
            ) : (
              <span className="text-xs text-text-3">
                {row.original.reviewedBy &&
                  `처리자: ${row.original.reviewedBy}`}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">카드 발급 요청</h1>
          <p className="text-sm text-text-3 mt-1">
            전체 {stats.total}개 • 대기중 {stats.pending}개 • 승인{" "}
            {stats.approved}개 • 거부 {stats.rejected}개
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1 mb-4">
        {[
          { value: "all", label: "전체", count: stats.total },
          { value: "pending", label: "대기중", count: stats.pending },
          { value: "approved", label: "승인", count: stats.approved },
          { value: "rejected", label: "거부", count: stats.rejected },
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
      {isLoading ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <p className="text-text-3">로딩 중...</p>
        </div>
      ) : (
        <BaseTable
          data={filteredRequests}
          columns={columns}
          enableSorting={true}
          enableFiltering={true}
          enablePagination={true}
          pageSize={10}
          searchPlaceholder="이름, 이메일, 전화번호 검색..."
          emptyMessage="카드 발급 요청이 없습니다."
        />
      )}
    </>
  );
}
