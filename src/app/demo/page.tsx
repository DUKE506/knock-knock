"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCardRequest } from "@/lib/api/cardRequest";

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    inviteCode: "",
    userName: "",
    userPhone: "",
    userEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 간단한 검증
    if (
      !formData.inviteCode ||
      !formData.userName ||
      !formData.userPhone ||
      !formData.userEmail
    ) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const { cardRequest, error } = await createCardRequest({
        inviteCode: formData.inviteCode,
        userName: formData.userName,
        userPhone: formData.userPhone,
        userEmail: formData.userEmail,
      });

      if (error || !cardRequest) {
        toast.error(
          typeof error === "string" ? error : "카드 발급 요청에 실패했습니다.",
        );
      } else {
        toast.success("카드 발급 요청이 완료되었습니다!");
        // 폼 초기화
        setFormData({
          inviteCode: "",
          userName: "",
          userPhone: "",
          userEmail: "",
        });
      }
    } catch (err) {
      toast.error("요청 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">
            Knock-Knock 테스트 페이지
          </h1>
          <p className="text-text-3">API 테스트 및 기능 확인용 페이지입니다</p>
        </div>

        {/* 카드 발급 요청 섹션 */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            <div className="w-8 h-8 rounded-md bg-accent-dim flex items-center justify-center">
              <Send className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">
                카드 발급 요청
              </h2>
              <p className="text-xs text-text-3">
                사업장 코드를 사용하여 카드 발급을 요청합니다
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 사업장 코드 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                사업장 코드 <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={formData.inviteCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inviteCode: e.target.value.toUpperCase(),
                  })
                }
                placeholder="예: ABCD-EFGH-IJKL-MNOP"
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors font-mono"
                disabled={isLoading}
                maxLength={19}
              />
            </div>

            {/* 사용자명 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                사용자명 <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                placeholder="홍길동"
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                전화번호 <span className="text-red">*</span>
              </label>
              <input
                type="tel"
                value={formData.userPhone}
                onChange={(e) =>
                  setFormData({ ...formData, userPhone: e.target.value })
                }
                placeholder="010-1234-5678"
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                이메일 <span className="text-red">*</span>
              </label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) =>
                  setFormData({ ...formData, userEmail: e.target.value })
                }
                placeholder="user@example.com"
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-[#059669] text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  카드 발급 요청
                </>
              )}
            </button>
          </form>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-accent-dim border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-accent">
            💡 이 페이지는 외부 시스템에서 카드 발급을 요청하는 과정을
            시뮬레이션합니다.
            <br />
            요청이 성공하면 Manager 페이지의 "카드 발급 요청" 목록에서 확인할 수
            있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
