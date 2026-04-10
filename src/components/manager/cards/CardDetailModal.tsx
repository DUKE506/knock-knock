"use client";

import { useState, useEffect } from "react";
import BaseModal from "@/components/common/modal/BaseModal";
import { CardRequest } from "@/types/manager/card/cardRequest";
import {
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Key,
} from "lucide-react";
import { getCardByRequestId } from "@/lib/api/card";
import { toast } from "sonner";

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardRequest: CardRequest | null;
}

export default function CardDetailModal({
  isOpen,
  onClose,
  cardRequest,
}: CardDetailModalProps) {
  const [isLoadingCard, setIsLoadingCard] = useState(false);
  const [cardData, setCardData] = useState<{
    cardNumber: string;
    activationCode: string;
    isActivated: boolean;
    expiresAt: string;
    status: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiresAt: "",
    status: "active",
  });

  // 카드 정보 불러오기
  useEffect(() => {
    if (!isOpen || !cardRequest || cardRequest.status !== "approved") return;

    const loadCardData = async () => {
      setIsLoadingCard(true);
      const { card, error } = await getCardByRequestId(cardRequest.id);

      if (error || !card) {
        toast.error("카드 정보를 불러오는데 실패했습니다.");
        setIsLoadingCard(false);
        return;
      }

      // 카드 데이터 설정
      setCardData({
        cardNumber: card.cardNumber,
        activationCode: card.activationCode,
        isActivated: card.isActivated,
        expiresAt: card.expiresAt,
        status: card.status,
      });

      // 폼 데이터 초기화
      setFormData({
        cardNumber: card.cardNumber,
        expiresAt: card.expiresAt.split("T")[0], // YYYY-MM-DD 형식으로 변환
        status: card.status,
      });

      setIsLoadingCard(false);
    };

    loadCardData();
  }, [isOpen, cardRequest]);

  const handleSave = async () => {
    // TODO: 카드 정보 업데이트 API 호출
    console.log("카드 정보 업데이트:", formData);
    toast.success("카드 정보가 업데이트되었습니다.");
    onClose();
  };

  if (!cardRequest) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="카드 상세 정보"
      onSubmit={handleSave}
      submitText="저장"
      size="md"
    >
      {isLoadingCard ? (
        <div className="py-12 text-center">
          <p className="text-text-3">카드 정보를 불러오는 중...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 사용자 정보 (읽기 전용) */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              사용자 정보
            </h3>
            <div className="bg-bg rounded-md p-4 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-3 w-16">이름</span>
                <span className="text-sm text-text font-medium">
                  {cardRequest.userName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 text-text-3" />
                <span className="text-sm text-text-2">
                  {cardRequest.userEmail}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-text-3" />
                <span className="text-sm text-text-2 font-mono">
                  {cardRequest.userPhone}
                </span>
              </div>
            </div>
          </div>

          {/* 요청 정보 (읽기 전용) */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              요청 정보
            </h3>
            <div className="bg-bg rounded-md p-4 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-3 w-20">요청일시</span>
                <span className="text-sm text-text-2 font-mono">
                  {cardRequest.requestedAt}
                </span>
              </div>
              {cardRequest.reviewedAt && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-3 w-20">승인일시</span>
                  <span className="text-sm text-text-2 font-mono">
                    {cardRequest.reviewedAt}
                  </span>
                </div>
              )}
              {cardRequest.reviewedBy && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-3 w-20">승인자</span>
                  <span className="text-sm text-text-2">
                    {cardRequest.reviewedBy}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 활성화번호 (모바일 미등록 시에만 표시) */}
          {cardData && !cardData.isActivated && (
            <div>
              <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                <Key className="w-4 h-4" />
                활성화번호
              </h3>
              <div className="bg-accent-dim border border-accent/20 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-accent mb-1">6자리 활성화번호</p>
                    <p className="text-2xl font-bold text-accent font-mono tracking-wider">
                      {cardData.activationCode}
                    </p>
                  </div>
                  <Key className="w-8 h-8 text-accent opacity-20" />
                </div>
                <p className="text-xs text-accent/70 mt-3">
                  ※ 사용자 이메일로 전송된 번호입니다
                </p>
              </div>
            </div>
          )}
          {/* 모바일 활성화 완료 표시 */}
          {cardData && cardData.isActivated && (
            <div>
              <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                <Key className="w-4 h-4" />
                활성화번호
              </h3>
              <div className="bg-green-dim border border-green/20 rounded-md px-4 py-3">
                <p className="text-xs text-green leading-relaxed flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  모바일 활성화 완료
                </p>
              </div>
            </div>
          )}

          {/* 카드 정보 (수정 가능) */}
          {cardData && (
            <div>
              <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                카드 정보
              </h3>
              <div className="space-y-3">
                {/* 카드 번호 */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    카드 번호
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: e.target.value })
                    }
                    placeholder="1234-5678-9012-3456"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors font-mono"
                    maxLength={19}
                  />
                </div>

                {/* 유효기간 */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    유효기간
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* 상태 */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    카드 상태
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                  >
                    <option value="active">활성</option>
                    <option value="suspended">정지</option>
                    <option value="expired">만료</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
}
