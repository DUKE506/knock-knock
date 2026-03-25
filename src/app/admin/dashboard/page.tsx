"use client";

import {
  Plus,
  Building2,
  CreditCard,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/common/Button";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";

export default function DashboardPage() {
  const { workplaces } = useWorkplaceStore();

  // 통계 계산
  const stats = {
    totalWorkplaces: workplaces.length,
    activeWorkplaces: workplaces.filter((w) => w.status === "active").length,
    totalCards: workplaces.reduce((sum, w) => sum + w.cardCount, 0),
    pendingRequests: workplaces.filter((w) => w.status === "pending").length,
    lowCreditWorkplaces: workplaces.filter((w) => {
      const percentage = (w.credit.remaining / w.credit.total) * 100;
      return percentage <= 20;
    }).length,
  };

  // 최근 사업장 (최대 5개)
  const recentWorkplaces = workplaces.slice(0, 5);

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">전체 현황</h1>
          <p className="text-sm text-text-3 mt-1">시스템 통계 및 최근 활동</p>
        </div>
        {/* <Link href="/admin/workplaces">
          <Button variant="primary" icon={Plus} title="사업장 생성" />
        </Link> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {/* Card 1 - Total Workplaces */}
        <div className="bg-surface border border-border rounded-lg p-5 relative overflow-hidden hover:shadow-sm transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent"></div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg bg-accent-dim flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent" />
              </div>
              <div className="text-sm font-medium text-text-2">전체 사업장</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-green">
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.activeWorkplaces}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-text">
            {stats.totalWorkplaces}
          </div>
        </div>

        {/* Card 2 - Active Cards */}
        <div className="bg-surface border border-border rounded-lg p-5 relative overflow-hidden hover:shadow-sm transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-green"></div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg bg-green-dim flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green" />
              </div>
              <div className="text-sm font-medium text-text-2">발급된 카드</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-text">
            {stats.totalCards.toLocaleString()}
          </div>
        </div>

        {/* Card 3 - Pending Requests */}
        <div className="bg-surface border border-border rounded-lg p-5 relative overflow-hidden hover:shadow-sm transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber"></div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg bg-amber-dim flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-amber" />
              </div>
              <div className="text-sm font-medium text-text-2">대기중</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-text">
            {stats.pendingRequests}
          </div>
        </div>

        {/* Card 4 - Low Credit Alert */}
        <div className="bg-surface border border-border rounded-lg p-5 relative overflow-hidden hover:shadow-sm transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red"></div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg bg-red-dim flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red" />
              </div>
              <div className="text-sm font-medium text-text-2">크레딧 부족</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-text">
            {stats.lowCreditWorkplaces}
          </div>
        </div>
      </div>

      {/* Recent Workplaces Section */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {/* Section Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-text">최근 사업장</h2>
            <p className="text-xs text-text-3 mt-0.5">
              최근에 생성된 사업장 목록
            </p>
          </div>
          <Link href="/admin/workplaces">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              title="전체보기"
            />
          </Link>
        </div>

        {/* Table */}
        {recentWorkplaces.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Building2 className="w-12 h-12 text-text-3 mx-auto mb-3 opacity-50" />
            <p className="text-sm text-text-3">등록된 사업장이 없습니다.</p>
            <Link href="/admin/workplaces">
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                title="첫 사업장 생성"
                className="mt-4"
              />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-3 uppercase tracking-wider">
                    사업장명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-3 uppercase tracking-wider">
                    발급코드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-3 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-3 uppercase tracking-wider">
                    크레딧
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-3 uppercase tracking-wider">
                    카드수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-3 uppercase tracking-wider">
                    생성일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentWorkplaces.map((workplace) => {
                  const creditPercentage = Math.round(
                    (workplace.credit.remaining / workplace.credit.total) * 100,
                  );
                  let creditBarColor = "bg-accent";
                  if (creditPercentage <= 20) creditBarColor = "bg-red";
                  else if (creditPercentage <= 50) creditBarColor = "bg-amber";

                  const statusConfig = {
                    active: {
                      label: "운영중",
                      color: "bg-green-dim text-green",
                    },
                    pending: {
                      label: "대기중",
                      color: "bg-amber-dim text-amber",
                    },
                    inactive: {
                      label: "비활성",
                      color: "bg-gray-200 text-text-3",
                    },
                  };

                  return (
                    <tr
                      key={workplace.id}
                      className="hover:bg-bg transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text">
                          {workplace.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-accent-dim text-accent px-2 py-1 rounded">
                          {workplace.issueCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${statusConfig[workplace.status].color}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {statusConfig[workplace.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[80px] h-2 bg-border rounded-full overflow-hidden">
                            <div
                              className={`h-full ${creditBarColor} transition-all`}
                              style={{ width: `${creditPercentage}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-xs text-text-2 min-w-[60px]">
                            {workplace.credit.remaining}
                            <span className="text-text-3">
                              /{workplace.credit.total}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-text-2">
                          {workplace.cardCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-3">
                          {workplace.createdAt}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
