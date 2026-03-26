"use client";

import { useState, useEffect } from "react";
import { Building2, Code, Calendar, Mail, Save } from "lucide-react";
import Button from "@/components/common/Button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [workplaceData, setWorkplaceData] = useState({
    id: "",
    name: "",
    issueCode: "",
    managerEmail: "",
    createdAt: "",
  });

  // TODO: 실제로는 Supabase에서 사업장 정보 불러오기
  useEffect(() => {
    // 더미 데이터
    setWorkplaceData({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "테크 스타트업",
      issueCode: "ABCD-EFGH-IJKL-MNOP",
      managerEmail: "manager@example.com",
      createdAt: "2025.03.01",
    });
  }, []);

  const handleSave = async () => {
    if (!workplaceData.name.trim()) {
      toast.error("사업장 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    // TODO: API 호출 - 사업장 정보 업데이트
    setTimeout(() => {
      toast.success("사업장 정보가 업데이트되었습니다.");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text">설정</h1>
        <p className="text-sm text-text-3 mt-1">사업장 정보 관리</p>
      </div>

      <div className="max-w-2xl">
        {/* 사업장 정보 카드 */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
            <div className="w-8 h-8 rounded-md bg-accent-dim flex items-center justify-center">
              <Building2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">사업장 정보</h2>
              <p className="text-xs text-text-3">
                사업장 기본 정보를 관리합니다
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* 사업장 이름 (수정 가능) */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                사업장 이름 <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={workplaceData.name}
                onChange={(e) =>
                  setWorkplaceData({ ...workplaceData, name: e.target.value })
                }
                placeholder="사업장 이름을 입력하세요"
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* 발급 코드 (읽기 전용) */}
            <div>
              <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                <Code className="w-3.5 h-3.5" />
                발급 코드
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={workplaceData.issueCode}
                  readOnly
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-bg text-text-3 font-mono cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-xs text-text-3 bg-surface px-2 py-1 rounded border border-border">
                    수정 불가
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-3 mt-1.5">
                ※ 발급 코드는 변경할 수 없습니다
              </p>
            </div>

            {/* 관리자 이메일 (읽기 전용) */}
            <div>
              <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                관리자 이메일
              </label>
              <input
                type="email"
                value={workplaceData.managerEmail}
                readOnly
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-bg text-text-3 cursor-not-allowed"
              />
            </div>

            {/* 생성일 (읽기 전용) */}
            <div>
              <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                생성일
              </label>
              <input
                type="text"
                value={workplaceData.createdAt}
                readOnly
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-bg text-text-3 font-mono cursor-not-allowed"
              />
            </div>

            {/* 저장 버튼 */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="primary"
                size="md"
                title="저장하기"
                onClick={handleSave}
                disabled={isLoading}
                icon={Save}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-accent-dim border border-accent/20 rounded-lg p-4 mt-6">
          <p className="text-sm text-accent leading-relaxed">
            <strong>💡 수정 가능한 항목</strong>
            <br />
            • 사업장 이름: 언제든지 변경 가능합니다
            <br />
            <br />
            <strong>수정 불가능한 항목</strong>
            <br />
            • 발급 코드: 보안상 변경할 수 없습니다
            <br />
            • 관리자 이메일: 사업장 생성 시 등록된 이메일입니다
            <br />• 생성일: 사업장이 최초 생성된 날짜입니다
          </p>
        </div>
      </div>
    </div>
  );
}
