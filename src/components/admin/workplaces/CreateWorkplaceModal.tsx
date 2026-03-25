"use client";

import { useState } from "react";
import { toast } from "sonner";
import BaseModal from "@/components/common/modal/BaseModal";
import { generateIssueCode } from "@/lib/utils/generateIssueCode";
import { sendIssueCodeEmail } from "@/lib/api/mail";
import { createWorkplace } from "@/lib/api/workplace";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { Workplace } from "@/types/workplace";

interface CreateWorkplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkplaceFormData {
  name: string;
  initialCredit: number;
  managerEmail?: string;
  memo?: string;
}

export default function CreateWorkplaceModal({
  isOpen,
  onClose,
}: CreateWorkplaceModalProps) {
  const [formData, setFormData] = useState<WorkplaceFormData>({
    name: "",
    initialCredit: 100,
    managerEmail: "",
    memo: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof WorkplaceFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const addWorkplace = useWorkplaceStore((state) => state.addWorkplace);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WorkplaceFormData, string>> = {};

    // 사업장명 검증
    if (!formData.name.trim()) {
      newErrors.name = "사업장명을 입력해주세요.";
    }

    // 초기 크레딧 검증
    if (formData.initialCredit <= 0) {
      newErrors.initialCredit = "1 이상의 크레딧을 입력해주세요.";
    }

    // 관리자 이메일 검증 (선택 사항이지만 입력했다면 유효성 검사)
    if (formData.managerEmail && formData.managerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.managerEmail)) {
        newErrors.managerEmail = "올바른 이메일 형식을 입력해주세요.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 1. 발급코드 생성
      const issueCode = generateIssueCode();

      // 2. Supabase에 저장
      const { workplace, error } = await createWorkplace({
        name: formData.name,
        issueCode,
        creditTotal: formData.initialCredit,
        managerEmail: formData.managerEmail,
      });

      if (error) {
        toast.error("사업장 생성에 실패했습니다.");
        console.error(error);
        return;
      }

      // 3. Zustand 스토어에 추가 (프론트 형식으로 변환)
      const newWorkplace: Workplace = {
        id: workplace.id,
        name: workplace.name,
        issueCode: workplace.issue_code,
        status: workplace.status as "active" | "pending" | "inactive",
        credit: {
          remaining: workplace.credit_remaining,
          total: workplace.credit_total,
        },
        cardCount: workplace.card_count,
        createdAt: new Date(workplace.created_at)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "."),
        managerEmail: workplace.manager_email,
      };

      addWorkplace(newWorkplace);

      // 4. 이메일 전송 (선택사항)
      if (formData.managerEmail && formData.managerEmail.trim()) {
        const mailResult = await sendIssueCodeEmail(
          formData.managerEmail,
          formData.name,
          issueCode,
          formData.initialCredit,
        );

        if (!mailResult.success) {
          console.error("이메일 전송 실패:", mailResult.error);
          toast.warning("사업장은 생성되었지만 이메일 전송에 실패했습니다.", {
            description: `발급코드: ${issueCode}`,
          });
        } else {
          toast.success(
            "사업장이 생성되고 발급코드가 이메일로 전송되었습니다!",
            {
              description: `발급코드: ${issueCode}`,
            },
          );
        }
      } else {
        toast.success("사업장이 생성되었습니다!", {
          description: `발급코드: ${issueCode}`,
        });
      }

      // 5. 폼 초기화 및 모달 닫기
      setFormData({
        name: "",
        initialCredit: 100,
        managerEmail: "",
        memo: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("사업장 생성 실패:", error);
      toast.error("사업장 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        initialCredit: 100,
        managerEmail: "",
        memo: "",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="사업장 생성"
      onSubmit={handleSubmit}
      submitText="생성"
      cancelText="취소"
      size="md"
      isLoading={isLoading}
      submitDisabled={!formData.name.trim() || formData.initialCredit <= 0}
    >
      <div className="space-y-5">
        {/* 사업장명 */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            사업장명 <span className="text-red">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="예: A 아파트, B 중학교"
            className={`w-full px-3 py-2 text-sm border rounded-radius-md outline-none transition-colors ${
              errors.name
                ? "border-red focus:border-red"
                : "border-border-2 focus:border-accent"
            }`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red">{errors.name}</p>
          )}
        </div>

        {/* 초기 크레딧 */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            초기 크레딧 <span className="text-red">*</span>
          </label>
          <input
            type="number"
            value={formData.initialCredit}
            onChange={(e) =>
              setFormData({
                ...formData,
                initialCredit: parseInt(e.target.value) || 0,
              })
            }
            placeholder="100"
            min="1"
            className={`w-full px-3 py-2 text-sm border rounded-radius-md outline-none transition-colors ${
              errors.initialCredit
                ? "border-red focus:border-red"
                : "border-border-2 focus:border-accent"
            }`}
            disabled={isLoading}
          />
          {errors.initialCredit && (
            <p className="mt-1.5 text-xs text-red">{errors.initialCredit}</p>
          )}
          <p className="mt-1.5 text-xs text-text-3">
            1 크레딧 = 카드 1개 발급 가능
          </p>
        </div>

        {/* 관리자 이메일 (선택) */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            관리자 이메일
          </label>
          <input
            type="email"
            value={formData.managerEmail}
            onChange={(e) =>
              setFormData({ ...formData, managerEmail: e.target.value })
            }
            placeholder="manager@example.com"
            className={`w-full px-3 py-2 text-sm border rounded-radius-md outline-none transition-colors ${
              errors.managerEmail
                ? "border-red focus:border-red"
                : "border-border-2 focus:border-accent"
            }`}
            disabled={isLoading}
          />
          {errors.managerEmail && (
            <p className="mt-1.5 text-xs text-red">{errors.managerEmail}</p>
          )}
          <p className="mt-1.5 text-xs text-text-3">
            발급코드를 받을 관리자 이메일 (선택 사항)
          </p>
        </div>

        {/* 메모 (선택) */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            메모
          </label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            placeholder="사업장에 대한 메모를 입력하세요 (선택 사항)"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-border-2 rounded-radius-md outline-none focus:border-accent transition-colors resize-none"
            disabled={isLoading}
          />
        </div>

        {/* 안내 메시지 */}
        <div className="bg-accent-dim border border-accent/20 rounded-radius-md px-4 py-3">
          <p className="text-xs text-accent leading-relaxed">
            💡 사업장 생성 시 16자리 발급코드가 자동으로 생성됩니다. (형식:
            XXXX-XXXX-XXXX-XXXX)
            <br />
            이메일을 입력하시면 발급코드가 자동으로 전송됩니다.
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
