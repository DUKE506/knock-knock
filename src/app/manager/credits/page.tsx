"use client";

import { useState } from "react";
import { Coins, Plus, Zap, ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { toast } from "sonner";

export default function CreditsPage() {
  const [currentCredits] = useState(150); // TODO: 실제 크레딧 정보
  const [totalCredits] = useState(500); // TODO: 전체 크레딧

  // 충전 요청
  const [requestAmount, setRequestAmount] = useState("");
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  // 충전 코드 입력
  const [rechargeCode, setRechargeCode] = useState("");
  const [isRechargeLoading, setIsRechargeLoading] = useState(false);

  // 크레딧 충전 요청
  const handleCreditRequest = async () => {
    if (!requestAmount || parseInt(requestAmount) <= 0) {
      toast.error("요청 수량을 입력해주세요.");
      return;
    }

    setIsRequestLoading(true);

    // TODO: API 호출 - 크레딧 충전 요청
    setTimeout(() => {
      toast.success(`${requestAmount}개 크레딧 충전 요청이 완료되었습니다.`);
      setRequestAmount("");
      setIsRequestLoading(false);
    }, 1000);
  };

  // 충전 코드 입력
  const handleRechargeCode = async () => {
    if (!rechargeCode.trim()) {
      toast.error("충전 코드를 입력해주세요.");
      return;
    }

    setIsRechargeLoading(true);

    // TODO: API 호출 - 충전 코드 검증 및 충전
    setTimeout(() => {
      toast.success("크레딧이 충전되었습니다!");
      setRechargeCode("");
      setIsRechargeLoading(false);
    }, 1000);
  };

  const creditPercentage = (currentCredits / totalCredits) * 100;

  return (
    <>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-text">크레딧 관리</h1>
        <p className="text-sm text-text-3 mt-1">잔여 크레딧 확인 및 충전</p>
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
                <p className="text-3xl font-bold">
                  {currentCredits.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">총 크레딧</p>
              <p className="text-xl font-semibold">
                {totalCredits.toLocaleString()}
              </p>
            </div>
          </div>

          {/* 크레딧 바 */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all duration-500"
              style={{ width: `${creditPercentage}%` }}
            />
          </div>
          <p className="text-xs opacity-75 mt-2">
            {creditPercentage.toFixed(1)}% 사용 중
          </p>
        </div>

        {/* 크레딧 충전 요청 */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            <div className="w-8 h-8 rounded-md bg-accent-dim flex items-center justify-center">
              <Plus className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">
                크레딧 충전 요청
              </h2>
              <p className="text-xs text-text-3">
                슈퍼관리자에게 크레딧 충전을 요청합니다
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 요청 수량 입력 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                요청 수량 <span className="text-red">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="예: 100"
                  min="1"
                  className="flex-1 px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                  disabled={isRequestLoading}
                />
                <Button
                  variant="primary"
                  size="md"
                  title="요청하기"
                  onClick={handleCreditRequest}
                  disabled={isRequestLoading}
                  icon={ArrowRight}
                />
              </div>
              <p className="text-xs text-text-3 mt-2">
                ※ 요청 후 슈퍼관리자 승인 시 충전 코드가 이메일로 발송됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 충전 코드 입력 */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            <div className="w-8 h-8 rounded-md bg-amber-dim flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">
                충전 코드 입력
              </h2>
              <p className="text-xs text-text-3">
                이메일로 받은 충전 코드를 입력하세요
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 충전 코드 입력 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                충전 코드 <span className="text-red">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rechargeCode}
                  onChange={(e) =>
                    setRechargeCode(e.target.value.toUpperCase())
                  }
                  placeholder="예: ABCD-EFGH-1234"
                  className="flex-1 px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors font-mono"
                  disabled={isRechargeLoading}
                  maxLength={19}
                />
                <Button
                  variant="primary"
                  size="md"
                  title="충전하기"
                  onClick={handleRechargeCode}
                  disabled={isRechargeLoading}
                  icon={Zap}
                />
              </div>
              <p className="text-xs text-text-3 mt-2">
                ※ 충전 코드는 1회만 사용 가능하며, 입력 즉시 크레딧이 충전됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-accent-dim border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-accent">
            💡 크레딧 충전 절차
            <br />
            1. 충전 요청 수량 입력 후 요청하기
            <br />
            2. 슈퍼관리자 승인 대기
            <br />
            3. 이메일로 충전 코드 수신
            <br />
            4. 충전 코드 입력 후 충전 완료
          </p>
        </div>
      </div>
    </>
  );
}
