"use client";

import { useEffect, useState, useCallback } from "react";
import { Coins } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchWorkplaceById } from "@/lib/api/workplace";
import { fetchCreditHistory, CreditHistory } from "@/lib/api/credit";
import { useQueryParams } from "@/hooks/useQueryParams";
import BaseTable from "@/components/common/table/BaseTable";
import { creditHistoryColumns } from "./columns";

export default function CreditsPage() {
  const user = useAuthStore((s) => s.user);
  const workplaceId = user?.workplaceId ?? "";

  // 크레딧 현황
  const [creditRemaining, setCreditRemaining] = useState<number | null>(null);
  const [creditTotal, setCreditTotal] = useState<number | null>(null);
  const [creditLoading, setCreditLoading] = useState(true);

  // 이력 테이블
  const [history, setHistory] = useState<CreditHistory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(true);

  const { params, setPage, setSearch } = useQueryParams({ initialPageSize: 10 });

  // 크레딧 현황 로드
  useEffect(() => {
    if (!workplaceId) return;
    setCreditLoading(true);
    fetchWorkplaceById(workplaceId).then(({ workplace }) => {
      if (workplace) {
        setCreditRemaining(workplace.creditRemaining);
        setCreditTotal(workplace.creditTotal);
      }
      setCreditLoading(false);
    });
  }, [workplaceId]);

  // 이력 로드
  const loadHistory = useCallback(async () => {
    if (!workplaceId) return;
    setHistoryLoading(true);
    const { data, error } = await fetchCreditHistory(params, { workplaceId });
    if (!error && data) {
      setHistory(data.data);
      setTotalCount(data.meta.totalCount);
      setTotalPages(data.meta.totalPages);
    }
    setHistoryLoading(false);
  }, [workplaceId, params]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const creditRemaining_ = creditRemaining ?? 0;
  const creditTotal_ = creditTotal ?? 0;
  const remainingPercentage = creditTotal_ > 0 ? (creditRemaining_ / creditTotal_) * 100 : 0;
  const usedPercentage = 100 - remainingPercentage;

  return (
    <>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-text">크레딧 관리</h1>
        <p className="text-sm text-text-3 mt-1">잔여 크레딧 확인 및 충전 이력</p>
      </div>

      <div className="space-y-6">
        {/* 크레딧 현황 카드 */}
        <div className="bg-gradient-to-br from-accent to-[#059669] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">현재 잔여 크레딧</p>
                {creditLoading ? (
                  <p className="text-3xl font-bold opacity-60">-</p>
                ) : (
                  <p className="text-3xl font-bold">
                    {(creditRemaining ?? 0).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">총 크레딧</p>
              {creditLoading ? (
                <p className="text-xl font-semibold opacity-60">-</p>
              ) : (
                <p className="text-xl font-semibold">
                  {(creditTotal ?? 0).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* 크레딧 바 */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all duration-500"
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
          <p className="text-xs opacity-75 mt-2">
            {creditLoading ? "로딩 중..." : `${usedPercentage.toFixed(1)}% 사용 중`}
          </p>
        </div>

        {/* 크레딧 이력 테이블 */}
        <BaseTable
          data={history}
          columns={creditHistoryColumns}
          emptyMessage="충전 이력이 없습니다."
          searchPlaceholder="처리자 검색"
          serverSide={{
            totalCount,
            currentPage: params.pageNumber,
            pageSize: params.pageSize,
            totalPages,
            currentSearch: params.search,
            isLoading: historyLoading,
            onPageChange: setPage,
            onSearch: setSearch,
          }}
        />
      </div>
    </>
  );
}
