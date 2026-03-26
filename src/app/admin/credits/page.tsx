"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  History,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import BaseModal from "@/components/common/modal/BaseModal";
import BaseTable from "@/components/common/table/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { useCreditHistoryStore } from "@/store/useCreditHistoryStore";
import {
  issueCreditCode,
  approveCreditRequest,
  rejectCreditRequest,
} from "@/lib/api/credit";
import type { CreditHistory } from "@/lib/api/credit";

type TabType = "requests" | "history";

export default function AdminCreditsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("requests");
  const [isLoading, setIsLoading] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // 크레딧 발급 폼
  const [issueForm, setIssueForm] = useState({
    amount: "",
    email: "",
  });

  const {
    creditHistory,
    syncWithSupabase,
    updateCreditHistory,
    addCreditHistory,
  } = useCreditHistoryStore();
  const [adminName] = useState("슈퍼관리자"); // TODO: 실제 로그인한 관리자 이름

  // 데이터 로드
  useEffect(() => {
    syncWithSupabase();
  }, [syncWithSupabase]);

  // 탭별 필터링된 데이터
  const requestsData = creditHistory.filter(
    (h) => h.type === "requested" && h.status === "pending",
  );
  const historyData = creditHistory;

  // 코드 직접 발급
  const handleIssueCode = async () => {
    if (!issueForm.amount || parseInt(issueForm.amount) <= 0) {
      toast.error("발급 수량을 입력해주세요.");
      return;
    }

    if (!issueForm.email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const {
        creditHistory: newHistory,
        code,
        error,
      } = await issueCreditCode({
        amount: parseInt(issueForm.amount),
        email: issueForm.email,
        createdBy: adminName,
      });

      if (error || !code) {
        toast.error("코드 발급에 실패했습니다.");
        return;
      }

      // TODO: 이메일 발송
      toast.success(`크레딧 코드가 발급되었습니다: ${code}`);

      // Store 업데이트
      if (newHistory) {
        addCreditHistory(newHistory as CreditHistory);
      }

      // 폼 초기화 및 모달 닫기
      setIssueForm({ amount: "", email: "" });
      setIsIssueModalOpen(false);
    } catch (err) {
      toast.error("코드 발급 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 요청 승인
  const handleApprove = async (id: string) => {
    const {
      creditHistory: updated,
      code,
      error,
    } = await approveCreditRequest(id, adminName);

    if (error || !code) {
      toast.error("승인 처리에 실패했습니다.");
      return;
    }

    toast.success(`승인되었습니다. 코드: ${code}`);

    // TODO: 이메일 발송

    // Store 업데이트
    updateCreditHistory(id, {
      status: "approved",
      code,
      reviewedBy: adminName,
      reviewedAt: new Date().toLocaleString("ko-KR"),
    });
  };

  // 요청 거부
  const handleReject = async (id: string) => {
    const reason = prompt("거부 사유를 입력하세요:");
    if (!reason) return;

    const { creditHistory: updated, error } = await rejectCreditRequest(
      id,
      adminName,
      reason,
    );

    if (error) {
      toast.error("거부 처리에 실패했습니다.");
      return;
    }

    toast.success("거부되었습니다.");

    // Store 업데이트
    updateCreditHistory(id, {
      status: "rejected",
      rejectReason: reason,
      reviewedBy: adminName,
      reviewedAt: new Date().toLocaleString("ko-KR"),
    });
  };

  // 요청 테이블 컬럼
  const requestColumns: ColumnDef<CreditHistory>[] = [
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
            onClick={() => handleApprove(row.original.id)}
          />
          <Button
            variant="danger"
            size="sm"
            title="거부"
            onClick={() => handleReject(row.original.id)}
          />
        </div>
      ),
    },
  ];

  // 이력 테이블 컬럼
  const historyColumns: ColumnDef<CreditHistory>[] = [
    {
      accessorKey: "type",
      header: "타입",
      cell: ({ row }) => {
        const isIssued = row.original.type === "issued";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
              isIssued
                ? "bg-blue-100 text-blue-600"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            {isIssued ? (
              <Zap className="w-3.5 h-3.5" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {isIssued ? "발급" : "요청"}
          </span>
        );
      },
    },
    {
      accessorKey: "workplaceName",
      header: "사업장",
      cell: ({ row }) => (
        <div className="text-sm text-text-2">
          {row.original.workplaceName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "수량",
      cell: ({ row }) => (
        <div className="text-sm text-text font-mono">
          {row.original.amount.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "코드",
      cell: ({ row }) => (
        <div className="text-sm text-text-2 font-mono">
          {row.original.code || "-"}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "이메일",
      cell: ({ row }) => (
        <div className="text-sm text-text-2">{row.original.email || "-"}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        if (row.original.type === "issued") {
          return <span className="text-xs text-text-3">-</span>;
        }

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

        const config = statusConfig[row.original.status!];
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
      accessorKey: "createdAt",
      header: "일시",
      cell: ({ row }) => (
        <div className="text-sm text-text-3 font-mono">
          {row.original.createdAt}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">크레딧 관리</h1>
          <p className="text-sm text-text-3 mt-1">코드 발급 및 요청 관리</p>
        </div>
        <Button
          variant="primary"
          size="md"
          title="코드 발급"
          icon={Plus}
          onClick={() => setIsIssueModalOpen(true)}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "requests"
              ? "bg-accent text-white"
              : "text-text-2 hover:text-text hover:bg-bg"
          }`}
        >
          <Send className="w-4 h-4" />
          충전 요청
          {requestsData.length > 0 && (
            <span className="ml-1 bg-red text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {requestsData.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "history"
              ? "bg-accent text-white"
              : "text-text-2 hover:text-text hover:bg-bg"
          }`}
        >
          <History className="w-4 h-4" />
          전체 이력
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "requests" && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-text-2">
              대기중인 요청:{" "}
              <span className="font-semibold text-text">
                {requestsData.length}개
              </span>
            </p>
          </div>
          <BaseTable
            data={requestsData}
            columns={requestColumns}
            enableSorting={true}
            enableFiltering={true}
            enablePagination={true}
            pageSize={10}
            searchPlaceholder="사업장, 요청자 검색..."
            emptyMessage="대기중인 요청이 없습니다."
          />
        </div>
      )}

      {activeTab === "history" && (
        <BaseTable
          data={historyData}
          columns={historyColumns}
          enableSorting={true}
          enableFiltering={true}
          enablePagination={true}
          pageSize={10}
          searchPlaceholder="사업장, 코드, 이메일 검색..."
          emptyMessage="이력이 없습니다."
        />
      )}

      {/* 코드 발급 모달 */}
      <BaseModal
        isOpen={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setIssueForm({ amount: "", email: "" });
        }}
        title="크레딧 코드 발급"
        onSubmit={handleIssueCode}
        submitText="발급하기"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-3">
            크레딧 코드를 생성하여 이메일로 발송합니다
          </p>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              발급 수량 <span className="text-red">*</span>
            </label>
            <input
              type="number"
              value={issueForm.amount}
              onChange={(e) =>
                setIssueForm({ ...issueForm, amount: e.target.value })
              }
              placeholder="100"
              min="1"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              이메일 <span className="text-red">*</span>
            </label>
            <input
              type="email"
              value={issueForm.email}
              onChange={(e) =>
                setIssueForm({ ...issueForm, email: e.target.value })
              }
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
          </div>

          <p className="text-xs text-text-3">
            ※ 발급된 코드는 입력된 이메일로 자동 발송됩니다
          </p>
        </div>
      </BaseModal>
    </div>
  );
}
