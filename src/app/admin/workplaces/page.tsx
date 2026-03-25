"use client";

import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import BaseTable from "@/components/common/table/BaseTable";
import CreateWorkplaceModal from "@/components/admin/workplaces/CreateWorkplaceModal";
import { workplaceColumns } from "./columns";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { Workplace } from "@/types/workplace";
import Button from "@/components/common/Button";

// 임시 더미 데이터
const mockWorkplaces: Workplace[] = [
  {
    id: "1",
    name: "A 아파트",
    issueCode: "KK-A4F2",
    status: "active",
    credit: { remaining: 82, total: 100 },
    cardCount: 312,
    createdAt: "2025.03.12",
    managerName: "김철수",
    managerEmail: "kim@a-apt.com",
  },
  {
    id: "2",
    name: "B 중학교",
    issueCode: "KK-B9D1",
    status: "active",
    credit: { remaining: 45, total: 100 },
    cardCount: 89,
    createdAt: "2025.04.01",
    managerName: "이영희",
    managerEmail: "lee@b-school.com",
  },
  {
    id: "3",
    name: "C 병원",
    issueCode: "KK-C7E3",
    status: "active",
    credit: { remaining: 11, total: 200 },
    cardCount: 430,
    createdAt: "2025.01.20",
    managerName: "박민준",
    managerEmail: "park@c-hospital.com",
  },
  {
    id: "4",
    name: "D 오피스",
    issueCode: "KK-D2K8",
    status: "pending",
    credit: { remaining: 67, total: 80 },
    cardCount: 201,
    createdAt: "2025.05.08",
    managerName: "정수진",
    managerEmail: "jung@d-office.com",
  },
  {
    id: "5",
    name: "E 아파트",
    issueCode: "KK-E5L0",
    status: "pending",
    credit: { remaining: 0, total: 50 },
    cardCount: 0,
    createdAt: "2025.06.15",
    managerName: "최동원",
    managerEmail: "choi@e-apt.com",
  },
  {
    id: "6",
    name: "F 연구소",
    issueCode: "KK-F1M4",
    status: "inactive",
    credit: { remaining: 30, total: 30 },
    cardCount: 57,
    createdAt: "2024.11.30",
    managerName: "한지원",
    managerEmail: "han@f-lab.com",
  },
  {
    id: "7",
    name: "G 복지관",
    issueCode: "KK-G8P3",
    status: "active",
    credit: { remaining: 150, total: 200 },
    cardCount: 98,
    createdAt: "2025.02.14",
    managerName: "강민수",
    managerEmail: "kang@g-center.com",
  },
  {
    id: "8",
    name: "H 대학교",
    issueCode: "KK-H3R7",
    status: "active",
    credit: { remaining: 890, total: 1000 },
    cardCount: 1245,
    createdAt: "2024.12.01",
    managerName: "서연주",
    managerEmail: "seo@h-univ.com",
  },
  {
    id: "9",
    name: "I 쇼핑몰",
    issueCode: "KK-I9T2",
    status: "active",
    credit: { remaining: 23, total: 150 },
    cardCount: 567,
    createdAt: "2025.03.28",
    managerName: "윤성호",
    managerEmail: "yoon@i-mall.com",
  },
  {
    id: "10",
    name: "J 체육관",
    issueCode: "KK-J4W1",
    status: "active",
    credit: { remaining: 78, total: 100 },
    cardCount: 134,
    createdAt: "2025.04.18",
    managerName: "임하늘",
    managerEmail: "lim@j-gym.com",
  },
  {
    id: "11",
    name: "K 도서관",
    issueCode: "KK-K7Y5",
    status: "inactive",
    credit: { remaining: 5, total: 50 },
    cardCount: 89,
    createdAt: "2024.09.10",
    managerName: "오민지",
    managerEmail: "oh@k-library.com",
  },
  {
    id: "12",
    name: "L 공장",
    issueCode: "KK-L2Q8",
    status: "active",
    credit: { remaining: 340, total: 500 },
    cardCount: 678,
    createdAt: "2025.01.05",
    managerName: "송재현",
    managerEmail: "song@l-factory.com",
  },
];

export default function WorkplacesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { workplaces, syncWithSupabase, setWorkplaces } = useWorkplaceStore();

  // 초기 데이터 로드 (임시)
  useEffect(() => {
    syncWithSupabase();
    // if (workplaces.length === 0) {
    //   // setWorkplaces(mockWorkplaces);
    // }
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">사업장 관리</h1>
          <p className="text-sm text-text-3 mt-1">
            전체 {workplaces.length}개 사업장
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Filter} title="필터" />

          <Button
            variant="primary"
            icon={Plus}
            title="사업장 생성"
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
        searchPlaceholder="사업장명, 코드 검색..."
        emptyMessage="등록된 사업장이 없습니다."
      />

      {/* Create Modal */}
      <CreateWorkplaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
